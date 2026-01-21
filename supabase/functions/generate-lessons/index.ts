import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation
const MAX_SKILL_DESCRIPTION_LENGTH = 500;
const MAX_ADJUSTMENT_PROMPT_LENGTH = 1000;
const MIN_SKILL_DESCRIPTION_LENGTH = 10;

function validateInput(skillDescription: unknown, adjustmentPrompt: unknown): { 
  valid: boolean; 
  error?: string; 
  skillDescription?: string;
  adjustmentPrompt?: string;
} {
  if (!skillDescription || typeof skillDescription !== 'string') {
    return { valid: false, error: 'Skill description is required and must be a string' };
  }
  
  const trimmedDescription = skillDescription.trim();
  if (trimmedDescription.length < MIN_SKILL_DESCRIPTION_LENGTH) {
    return { valid: false, error: `Skill description must be at least ${MIN_SKILL_DESCRIPTION_LENGTH} characters` };
  }
  
  if (trimmedDescription.length > MAX_SKILL_DESCRIPTION_LENGTH) {
    return { valid: false, error: `Skill description must be less than ${MAX_SKILL_DESCRIPTION_LENGTH} characters` };
  }
  
  let trimmedAdjustment: string | undefined;
  if (adjustmentPrompt !== undefined && adjustmentPrompt !== null) {
    if (typeof adjustmentPrompt !== 'string') {
      return { valid: false, error: 'Adjustment prompt must be a string' };
    }
    trimmedAdjustment = adjustmentPrompt.trim();
    if (trimmedAdjustment.length > MAX_ADJUSTMENT_PROMPT_LENGTH) {
      return { valid: false, error: `Adjustment prompt must be less than ${MAX_ADJUSTMENT_PROMPT_LENGTH} characters` };
    }
  }
  
  return { 
    valid: true, 
    skillDescription: trimmedDescription,
    adjustmentPrompt: trimmedAdjustment
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    // Parse and validate input
    const body = await req.json();
    const validation = validateInput(body.skillDescription, body.adjustmentPrompt);
    
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { skillDescription, adjustmentPrompt } = validation;
    console.log('Generating lessons for skill:', skillDescription);

    const systemPrompt = adjustmentPrompt 
      ? `You are an expert curriculum designer. Create a structured learning path with 6 progressive lessons for the skill: "${skillDescription}".

User feedback: ${adjustmentPrompt}

Adjust the lessons based on this feedback while maintaining a clear learning progression.`
      : `You are an expert curriculum designer. Create a structured learning path with exactly 6 progressive lessons for the skill: "${skillDescription}".

Requirements:
- Exactly 6 lessons, numbered 0-5
- Start with fundamentals and progress to advanced concepts
- Each lesson title should be clear and actionable
- Format: "0: [Title]", "1: [Title]", etc.
- Make titles engaging and specific to the skill`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: 'Generate the 6 lesson titles. Return ONLY the lesson titles in this exact format:\n0: [Title]\n1: [Title]\n2: [Title]\n3: [Title]\n4: [Title]\n5: [Title]'
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please add credits to your Lovable workspace.');
      }
      
      throw new Error(`AI generation failed: ${errorText}`);
    }

    const result = await response.json();
    const generatedText = result.choices?.[0]?.message?.content || '';
    
    console.log('Raw AI response:', generatedText);

    // Parse the lessons from the response
    const lessonLines = generatedText.split('\n').filter((line: string) => line.trim());
    const lessons = lessonLines
      .map((line: string) => {
        const match = line.match(/^\d+:\s*(.+)$/);
        if (match) {
          return {
            title: match[0].trim(),
            locked: line.startsWith('0:') || line.startsWith('1:') || line.startsWith('2:') ? false : true
          };
        }
        return null;
      })
      .filter((lesson: any) => lesson !== null);

    // Ensure we have exactly 6 lessons
    if (lessons.length !== 6) {
      console.warn('Expected 6 lessons, got:', lessons.length);
      // Fill in missing lessons if needed
      while (lessons.length < 6) {
        lessons.push({
          title: `${lessons.length}: Advanced Topic`,
          locked: true
        });
      }
    }

    console.log('Generated lessons:', lessons);

    return new Response(
      JSON.stringify({ lessons }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Lesson generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
