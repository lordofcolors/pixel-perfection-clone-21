import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

function validateAudioInput(audio: unknown): { valid: boolean; error?: string; audio?: string } {
  if (!audio || typeof audio !== 'string') {
    return { valid: false, error: 'Audio data is required and must be a base64 string' };
  }
  
  const trimmedAudio = audio.trim();
  if (trimmedAudio.length === 0) {
    return { valid: false, error: 'Audio data cannot be empty' };
  }
  
  // Check approximate size (base64 is ~4/3 the size of binary)
  const approximateSizeBytes = (trimmedAudio.length * 3) / 4;
  if (approximateSizeBytes > MAX_AUDIO_SIZE_BYTES) {
    return { valid: false, error: `Audio file too large. Maximum size is ${MAX_AUDIO_SIZE_BYTES / (1024 * 1024)}MB` };
  }
  
  // Basic base64 validation
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  // Check if it has a data URL prefix and extract the base64 part
  let base64Data = trimmedAudio;
  if (trimmedAudio.includes(',')) {
    base64Data = trimmedAudio.split(',')[1] || '';
  }
  
  if (!base64Regex.test(base64Data.replace(/\s/g, ''))) {
    return { valid: false, error: 'Invalid audio data format' };
  }
  
  return { valid: true, audio: trimmedAudio };
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
    const validation = validateAudioInput(body.audio);
    
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { audio } = validation;
    console.log('Processing audio data with Lovable AI...');
    
    // Use Lovable AI's chat completions endpoint with audio input
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
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please transcribe this audio recording. Only return the transcribed text, nothing else.'
              },
              {
                type: 'audio',
                audio: audio
              }
            ]
          }
        ]
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
      
      throw new Error(`Lovable AI error: ${errorText}`);
    }

    const result = await response.json();
    const transcribedText = result.choices?.[0]?.message?.content || '';
    
    console.log('Transcription successful');

    return new Response(
      JSON.stringify({ text: transcribedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Speech-to-text error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
