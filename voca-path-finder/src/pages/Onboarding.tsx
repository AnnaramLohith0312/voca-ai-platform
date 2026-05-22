import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useVoca } from "@/contexts/VocaContext";
import type { OnboardingAnswer } from "@/services/interfaces";
import { sendMessage, startConversation, isAIConfigured } from "@/engine/aiAgent";
import type { AgentMessage } from "@/engine/aiAgent";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  isBig: boolean;
  isTyping?: boolean;
}

// ─── Voice Recognition Setup ─────────────────────────────────────────────────

type SpeechRecognitionType = typeof window extends { SpeechRecognition: infer T } ? T : never;
const SpeechRecognition =
  (window as unknown as { SpeechRecognition?: SpeechRecognitionType; webkitSpeechRecognition?: SpeechRecognitionType })
    .SpeechRecognition ||
  (window as unknown as { SpeechRecognition?: SpeechRecognitionType; webkitSpeechRecognition?: SpeechRecognitionType })
    .webkitSpeechRecognition;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completeOnboarding } = useVoca();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<AgentMessage[]>([]);
  const [progress, setProgress] = useState(5);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(null);

  // ── Scroll to bottom ────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 60);
  }, []);

  // ── Add message helper ───────────────────────────────────────────
  const addMessage = useCallback((msg: Omit<ChatMessage, "id">) => {
    const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setMessages((prev) => [...prev, { ...msg, id }]);
    scrollToBottom();
    return id;
  }, [scrollToBottom]);

  // ── Remove typing indicator ──────────────────────────────────────
  const removeTypingIndicator = useCallback(() => {
    setMessages((prev) => prev.filter((m) => !m.isTyping));
  }, []);

  // ── Mount: get AI greeting ───────────────────────────────────────
  useEffect(() => {
    setIsMockMode(!isAIConfigured());

    const init = async () => {
      // Show typing indicator
      addMessage({ text: "...", isUser: false, isBig: false, isTyping: true });

      const response = await startConversation();
      removeTypingIndicator();

      if (response.reply) {
        addMessage({ text: response.reply, isUser: false, isBig: true });
        setProgress(response.progress || 10);

        setHistory([
          { role: "model", parts: response.rawReply }
        ]);
      }
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handle send ─────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isLoading || isDone) return;

    setInputText("");
    setIsLoading(true);

    // Add user message to chat
    addMessage({ text, isUser: true, isBig: false });

    // Build new history with user message
    const newHistory: AgentMessage[] = [
      ...history,
      { role: "user", parts: text },
    ];

    // Show typing indicator
    setTimeout(() => {
      addMessage({ text: "...", isUser: false, isBig: false, isTyping: true });
      scrollToBottom();
    }, 300);

    try {
      const response = await sendMessage(newHistory, text);
      removeTypingIndicator();

      // Update progress
      if (response.progress > progress) {
        setProgress(response.progress);
      }

      // Add AI reply
      if (response.reply) {
        addMessage({ text: response.reply, isUser: false, isBig: false });
      }

      // Update history
      setHistory([
        ...newHistory,
        { role: "model", parts: response.rawReply },
      ]);

      // Conversation complete — extract signals and navigate
      if (response.isDone && response.signals) {
        setIsDone(true);
        setProgress(100);

        // Build OnboardingAnswer array from rawAnswers
        const answers: OnboardingAnswer[] = Object.entries(
          response.answersMap ?? {}
        ).map(([question, answer]) => ({ question, answer }));

        // Store signals for the engine
        const signalsPayload = response.signals;

        await completeOnboarding(answers, signalsPayload);

        setTimeout(() => navigate("/analysis"), 1800);
      }
    } catch {
      removeTypingIndicator();
      addMessage({
        text: "Hmm, something went wrong. Please try again.",
        isUser: false,
        isBig: false,
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [inputText, isLoading, isDone, history, progress, addMessage, removeTypingIndicator, scrollToBottom, completeOnboarding, navigate]);

  // ── Handle Enter key ────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Voice recognition ────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: Event) => {
      const e = event as unknown as { results: { [key: number]: { [key: number]: { transcript: string }; isFinal: boolean } }; resultIndex: number };
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < Object.keys(e.results).length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      setInputText(final || interim);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening]);

  // ── Auto-resize textarea ─────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0b0e12" }}>

      {/* ── Progress bar ─────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px]" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #0ea5a0, #14b8a6)",
            boxShadow: "0 0 12px rgba(14,165,160,0.6)",
          }}
        />
      </div>

      {/* ── Header ───────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 h-16 border-b border-white/[0.07]"
        style={{ background: "rgba(11,14,18,0.85)", backdropFilter: "blur(16px)", marginTop: "2px" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[22px] font-headline font-semibold tracking-tight" style={{ color: "#e8e9ec" }}>
            VOCA
          </span>
          {isMockMode && (
            <span
              className="text-[10px] font-body px-2 py-0.5 rounded-full border"
              style={{ color: "#c99a43", borderColor: "rgba(201,154,67,0.3)", background: "rgba(201,154,67,0.08)" }}
            >
              DEMO MODE
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Progress pill */}
          <span
            className="text-xs font-body px-3 py-1 rounded-full border"
            style={{ color: "#0ea5a0", borderColor: "rgba(14,165,160,0.25)", background: "rgba(14,165,160,0.08)" }}
          >
            {progress < 100 ? `${progress}% complete` : "Analysing…"}
          </span>
          <button
            className="text-sm font-body px-4 py-2 rounded-full border border-white/10 transition-all hover:border-white/20"
            style={{ color: "#8b95a7" }}
            onClick={() => window.location.href = "mailto:support@voca.ai"}
          >
            Support
          </button>
        </div>
      </header>

      {/* ── Chat area ────────────────────────────────── */}
      <main
        ref={chatRef}
        className="flex-1 overflow-y-auto pt-24 pb-44"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="max-w-[680px] mx-auto px-5 space-y-5 py-6">

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              style={{ animation: "messageIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards" }}
            >
              {msg.isUser ? (
                /* ── User bubble ── */
                <div
                  className="max-w-[78%] px-5 py-3 rounded-2xl rounded-br-md"
                  style={{ background: "rgba(14,165,160,0.18)", border: "1px solid rgba(14,165,160,0.25)", color: "#e8e9ec" }}
                >
                  <span className="font-body font-medium text-[15px] leading-relaxed">{msg.text}</span>
                </div>
              ) : msg.isTyping ? (
                /* ── Typing indicator ── */
                <div
                  className="px-5 py-4 rounded-2xl rounded-bl-md"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="voca-typing-dots flex gap-1.5 items-center h-4">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              ) : (
                /* ── VOCA bubble ── */
                <div
                  className="max-w-[88%] px-5 py-4 rounded-2xl rounded-bl-md"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {msg.isBig ? (
                    <p
                      className="font-headline font-semibold leading-snug"
                      style={{ fontSize: "clamp(18px,2.5vw,24px)", color: "#e8e9ec" }}
                    >
                      {msg.text}
                    </p>
                  ) : (
                    <p className="font-body text-[15px] leading-relaxed" style={{ color: "#c2c8d4" }}>
                      {msg.text}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Bottom anchor for scroll */}
          <div style={{ height: 1 }} />
        </div>
      </main>

      {/* ── Input bar ─────────────────────────────────── */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.07]"
        style={{ background: "rgba(11,14,18,0.92)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-[680px] mx-auto px-4 py-4">

          {isDone ? (
            /* ── Finalizing state ── */
            <div className="flex justify-center items-center gap-3 py-3" style={{ color: "#8b95a7" }}>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="rgba(14,165,160,0.3)" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#0ea5a0" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-body">Building your career map…</span>
            </div>
          ) : (
            /* ── Active input ── */
            <div
              className="flex items-end gap-3 rounded-2xl p-3 transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${isListening ? "rgba(14,165,160,0.5)" : "rgba(255,255,255,0.1)"}`,
                boxShadow: isListening ? "0 0 20px rgba(14,165,160,0.15)" : "none",
              }}
            >
              {/* Textarea */}
              <textarea
                ref={inputRef}
                className="flex-1 bg-transparent font-body text-[15px] resize-none outline-none leading-relaxed"
                style={{ color: "#e8e9ec", minHeight: "24px", maxHeight: "120px" }}
                placeholder={isListening ? "🎤 Listening…" : "Type your answer or click the mic…"}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isLoading}
              />

              {/* Mic button */}
              <button
                onClick={toggleVoice}
                disabled={isLoading}
                title="Voice input"
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: isListening ? "rgba(14,165,160,0.25)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isListening ? "rgba(14,165,160,0.5)" : "rgba(255,255,255,0.1)"}`,
                  color: isListening ? "#0ea5a0" : "#8b95a7",
                }}
              >
                {isListening ? (
                  /* Animated mic waves */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    <circle cx="12" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
                      <animate attributeName="r" from="7" to="11" dur="1s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.4" to="0" dur="1s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                )}
              </button>

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: inputText.trim() && !isLoading
                    ? "linear-gradient(135deg,#0ea5a0,#14b8a6)"
                    : "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: inputText.trim() && !isLoading ? "#fff" : "#4a5568",
                  cursor: inputText.trim() && !isLoading ? "pointer" : "not-allowed",
                }}
              >
                {isLoading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22 11 13 2 9l20-7z" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Helper text */}
          {!isDone && (
            <p className="text-center text-[11px] font-body mt-2" style={{ color: "#4a5568" }}>
              Press <kbd className="px-1 rounded" style={{ background: "rgba(255,255,255,0.07)", color: "#6b7280" }}>Enter</kbd> to send &nbsp;·&nbsp;
              <kbd className="px-1 rounded" style={{ background: "rgba(255,255,255,0.07)", color: "#6b7280" }}>Shift+Enter</kbd> for new line &nbsp;·&nbsp;
              🎤 for voice
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
