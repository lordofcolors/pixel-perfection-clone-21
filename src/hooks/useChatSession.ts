/**
 * =============================================================================
 * useChatSession Hook
 * =============================================================================
 *
 * Manages the entire lifecycle of a chat session on the /chat page:
 *
 * 1. **Loading sequence** — cycles through friendly loading messages, then
 *    reveals the main UI with a fade-in.
 * 2. **Greeting typewriter** — types out the AI greeting character-by-character
 *    once the UI is visible.
 * 3. **AI response typewriter** — subsequent AI messages also get the
 *    typewriter treatment so the response bubble always animates.
 * 4. **Message history** — stores all chat messages (user + AI) and exposes
 *    a `sendMessage` callback that appends user messages and triggers a
 *    mock AI reply after a short delay.
 *
 * This hook is a pure state machine with no DOM/rendering concerns — it
 * returns values that the UI components consume.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  type ChatMessage,
  LOADING_STATES,
  LOADING_INTERVAL,
  AI_RESPONSES,
} from "@/components/chat/types";

interface UseChatSessionOptions {
  /** The learner's first name, used to personalise the greeting. */
  firstName?: string;
}

interface UseChatSessionReturn {
  // -- Loading phase --
  isLoading: boolean;
  loadingIndex: number;
  showContent: boolean;

  // -- Greeting typewriter --
  showGreeting: boolean;
  greetingText: string;
  typedText: string;

  // -- AI response typewriter --
  displayedAiText: string;
  isTypingResponse: boolean;

  // -- Computed text for the response bubble --
  responseBubbleText: string;
  showResponseCursor: boolean;

  // -- Chat messages --
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => void;

  // -- Inline input state (lifted so transcript panel can share it) --
  inputValue: string;
  setInputValue: (val: string) => void;
  handleInlineSend: () => void;

  // -- Session lifecycle --
  sessionEnded: boolean;
  showContinueModal: boolean;
  handleDisconnect: () => void;
  restartSession: () => void;
  closeContinueModal: () => void;
}

export function useChatSession({ firstName }: UseChatSessionOptions): UseChatSessionReturn {
  // -----------------------------------------------------------------------
  // Loading sequence
  // -----------------------------------------------------------------------

  const [isLoading, setIsLoading] = useState(true);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  /** Cycle through LOADING_STATES then hide the overlay. */
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingIndex((prev) => {
        if (prev >= LOADING_STATES.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), LOADING_INTERVAL);
          return prev;
        }
        return prev + 1;
      });
    }, LOADING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  /** After loading finishes, trigger a double-rAF to reveal main content. */
  useEffect(() => {
    if (!isLoading) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setShowContent(true));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isLoading]);

  /** 800ms after content is visible, start the greeting typewriter. */
  useEffect(() => {
    if (showContent) {
      const id = setTimeout(() => setShowGreeting(true), 800);
      return () => clearTimeout(id);
    }
  }, [showContent]);

  // -----------------------------------------------------------------------
  // Greeting typewriter
  // -----------------------------------------------------------------------

  const greetingText = `Hi${firstName ? `, ${firstName}` : ""}! I'm A! It's nice to meet you!`;
  const [typedText, setTypedText] = useState("");
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Type out the greeting one character at a time (45ms per char). */
  useEffect(() => {
    if (!showGreeting) return;
    let i = 0;
    typingRef.current = setInterval(() => {
      i += 1;
      setTypedText(greetingText.slice(0, i));
      if (i >= greetingText.length && typingRef.current) {
        clearInterval(typingRef.current);
      }
    }, 45);
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, [showGreeting, greetingText]);

  // -----------------------------------------------------------------------
  // AI response typewriter
  // -----------------------------------------------------------------------

  const [latestAiText, setLatestAiText] = useState("");
  const [displayedAiText, setDisplayedAiText] = useState("");
  const [isTypingResponse, setIsTypingResponse] = useState(false);
  const aiTypingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Once the greeting finishes typing, sync the AI text state. */
  useEffect(() => {
    if (showGreeting && typedText === greetingText) {
      setLatestAiText(greetingText);
      setDisplayedAiText(greetingText);
    }
  }, [showGreeting, typedText, greetingText]);

  /** Animate new AI responses character-by-character (35ms per char). */
  useEffect(() => {
    if (!latestAiText || latestAiText === greetingText) return;

    setDisplayedAiText("");
    setIsTypingResponse(true);
    let i = 0;

    if (aiTypingRef.current) clearInterval(aiTypingRef.current);

    aiTypingRef.current = setInterval(() => {
      i += 1;
      setDisplayedAiText(latestAiText.slice(0, i));
      if (i >= latestAiText.length) {
        if (aiTypingRef.current) clearInterval(aiTypingRef.current);
        setIsTypingResponse(false);
      }
    }, 35);

    return () => {
      if (aiTypingRef.current) clearInterval(aiTypingRef.current);
    };
  }, [latestAiText, greetingText]);

  // -----------------------------------------------------------------------
  // Computed bubble text
  // -----------------------------------------------------------------------

  /** The text currently shown in the response bubble above the input. */
  const responseBubbleText = displayedAiText || typedText;

  /** Whether the blinking cursor should be visible. */
  const showResponseCursor =
    isTypingResponse ||
    (showGreeting && !displayedAiText && typedText.length < greetingText.length);

  // -----------------------------------------------------------------------
  // Chat messages
  // -----------------------------------------------------------------------

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "greeting", sender: "ai", text: greetingText },
  ]);

  /**
   * Send a user message and trigger a mock AI reply.
   * In production this would call the AI backend instead.
   */
  const sendMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, sender: "user", text };
    setChatMessages((prev) => [...prev, userMsg]);

    // Simulate AI thinking time (1.2–2s) then reply with a random response
    setTimeout(() => {
      const aiText = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const aiMsg: ChatMessage = { id: `ai-${Date.now()}`, sender: "ai", text: aiText };
      setChatMessages((prev) => [...prev, aiMsg]);
      setLatestAiText(aiText);
    }, 1200 + Math.random() * 800);
  }, []);

  // -----------------------------------------------------------------------
  // Inline input (shared between inline chat and transcript panel)
  // -----------------------------------------------------------------------

  const [inputValue, setInputValue] = useState("");

  const handleInlineSend = useCallback(() => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue.trim());
    setInputValue("");
  }, [inputValue, sendMessage]);

  // -----------------------------------------------------------------------
  // Session lifecycle
  // -----------------------------------------------------------------------

  const [sessionEnded, setSessionEnded] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);

  /** End the session and show the upsell modal after 1 second. */
  const handleDisconnect = useCallback(() => {
    setSessionEnded(true);
    setTimeout(() => setShowContinueModal(true), 1000);
  }, []);

  /** Reset flags so the user can start a new session. */
  const restartSession = useCallback(() => {
    setSessionEnded(false);
    setShowContinueModal(false);
  }, []);

  const closeContinueModal = useCallback(() => {
    setShowContinueModal(false);
  }, []);

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  return {
    isLoading,
    loadingIndex,
    showContent,
    showGreeting,
    greetingText,
    typedText,
    displayedAiText,
    isTypingResponse,
    responseBubbleText,
    showResponseCursor,
    chatMessages,
    sendMessage,
    inputValue,
    setInputValue,
    handleInlineSend,
    sessionEnded,
    showContinueModal,
    handleDisconnect,
    restartSession,
    closeContinueModal,
  };
}
