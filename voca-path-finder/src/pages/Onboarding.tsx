import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useVoca } from "@/contexts/VocaContext";
import type { OnboardingAnswer } from "@/services/interfaces";
import { detectStage } from "@/engine/stageDetection";
import { INITIAL_QUESTION, STAGE_QUESTIONS } from "@/engine/questionBank";
import type { UserStage } from "@/services/interfaces";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  isBig: boolean;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completeOnboarding } = useVoca();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStage, setCurrentStage] = useState<UserStage | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(-1); // -1 means initial question
  const [progress, setProgress] = useState(15);
  const [chips, setChips] = useState<string[]>(INITIAL_QUESTION.options);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);
  const [done, setDone] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 50);
  };

  const addMessage = (msg: Omit<ChatMessage, "id">) => {
    const id = `msg_${Date.now()}_${Math.random()}`;
    setMessages((prev) => [...prev, { ...msg, id }]);
    scrollToBottom();
  };

  // Mount: show intro messages then first question
  useEffect(() => {
    const intro: ChatMessage = {
      id: "intro_1",
      text: "Hi, I'm VOCA. I'll help you map the career path that fits you best.",
      isUser: false,
      isBig: false,
    };
    const firstQ: ChatMessage = {
      id: "intro_2",
      text: INITIAL_QUESTION.question,
      isUser: false,
      isBig: true,
    };

    setTimeout(() => {
      setMessages([intro]);
      scrollToBottom();
    }, 200);

    setTimeout(() => {
      setMessages([intro, firstQ]);
      scrollToBottom();
    }, 800);
  }, []);

  const handleChipSelect = (chip: string) => {
    if (isTransitioning || done) return;

    setSelectedChip(chip);
    setIsTransitioning(true);

    // Step 1: mark chip active (already via selectedChip state)
    // Step 2: after 300ms add user bubble
    setTimeout(() => {
      addMessage({ text: chip, isUser: true, isBig: false });

      // Calculate next state
      if (currentStage === null) {
        // We answered the initial stage selection question
        const detection = detectStage(chip);
        
        if (detection.stage === "unknown") {
          // Low confidence -> clarification loop
          setTimeout(() => {
            addMessage({
              text: "I want to make sure I give you the best advice. Are you currently in school, pursuing a degree, or already working?",
              isUser: false,
              isBig: true,
            });

            setSelectedChip(null);
            setChips([
              "In school (Class 10)",
              "In school (11th/12th)",
              "In college/UG",
              "Working professional"
            ]);
            setIsTransitioning(false);
            scrollToBottom();
          }, 600);
          return;
        }

        const detectedStage = detection.stage;
        const stageQ = STAGE_QUESTIONS[detectedStage];
        const newAnswers: OnboardingAnswer[] = [
          { question: INITIAL_QUESTION.question, answer: chip }
        ];

        setAnswers(newAnswers);
        setCurrentStage(detectedStage);
        setQuestionIndex(0);
        setProgress(20);

        // After 600ms, show the first question of the selected stage
        setTimeout(() => {
          const nextQ = stageQ[0];
          addMessage({
            text: nextQ.question,
            isUser: false,
            isBig: true,
          });

          setSelectedChip(null);
          setChips(nextQ.options);
          setIsTransitioning(false);
          scrollToBottom();
        }, 600);

      } else {
        // We are answering stage-specific questions
        const stageQ = STAGE_QUESTIONS[currentStage];
        const currentQ = stageQ[questionIndex];
        const newAnswers: OnboardingAnswer[] = [
          ...answers,
          { question: currentQ.question, answer: chip },
        ];
        setAnswers(newAnswers);

        const nextIndex = questionIndex + 1;
        
        if (nextIndex >= stageQ.length) {
          // Completed all questions for this stage!
          setDone(true);
          setProgress(100);

          setTimeout(() => {
            addMessage({
              text: "Thank you. We're finalizing your profile now.",
              isUser: false,
              isBig: false,
            });

            completeOnboarding(newAnswers).then(() => {
              setTimeout(() => {
                navigate("/analysis");
              }, 1500);
            });
          }, 600);
        } else {
          // Move to next question in the stage
          setQuestionIndex(nextIndex);
          setProgress(Math.floor(20 + (80 * (nextIndex) / stageQ.length)));

          setTimeout(() => {
            const nextQ = stageQ[nextIndex];
            addMessage({
              text: nextQ.question,
              isUser: false,
              isBig: true,
            });

            setSelectedChip(null);
            setChips(nextQ.options);
            setIsTransitioning(false);
            scrollToBottom();
          }, 600);
        }
      }
    }, 300);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0b0e12" }}
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 progress-track h-[2px]">
        <div
          className="progress-fill h-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 h-16 border-b border-white/[0.07]"
        style={{
          background: "rgba(11, 14, 18, 0.80)",
          backdropFilter: "blur(12px)",
          marginTop: "2px",
        }}
      >
        <span
          className="text-[24px] font-headline font-semibold tracking-tight"
          style={{ color: "#e8e9ec" }}
        >
          VOCA
        </span>
        <button
          className="text-sm font-body px-4 py-2 rounded-full border border-white/10 transition-all hover:border-white/20"
          style={{ color: "#8b95a7" }}
          onClick={() => window.location.href = "mailto:support@voca.ai"}
        >
          Support
        </button>
      </header>

      {/* Chat area */}
      <main
        ref={chatRef}
        className="chat-scroll flex-1 overflow-y-auto pt-24 pb-48"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="max-w-[680px] mx-auto px-6 space-y-4 py-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`animate-[messageIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards] ${
                msg.isUser ? "flex justify-end" : "flex justify-start"
              }`}
            >
              {msg.isUser ? (
                <div className="user-bubble max-w-[80%]">
                  <span className="font-body font-medium text-[15px]">
                    {msg.text}
                  </span>
                </div>
              ) : (
                <div className="voca-bubble max-w-[88%]">
                  {msg.isBig ? (
                    <p
                      className="font-headline font-semibold"
                      style={{ fontSize: "24px", color: "#e8e9ec", lineHeight: 1.3 }}
                    >
                      {msg.text}
                    </p>
                  ) : (
                    <p className="font-body text-[15px]" style={{ color: "#8b95a7" }}>
                      {msg.text}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer with chips */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.07] py-6 px-6"
        style={{
          background: "rgba(11, 14, 18, 0.90)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-[680px] mx-auto">
          {chips.length > 0 && !done && (
            <>
              <p
                className="text-center text-xs font-body mb-4 uppercase tracking-widest"
                style={{ color: "#8b95a7" }}
              >
                Choose your answer
              </p>
              <div
                className={`flex flex-wrap justify-center gap-3 transition-opacity duration-200 ${
                  isTransitioning ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                {chips.map((chip) => (
                  <button
                    key={chip}
                    className={`reply-chip ${selectedChip === chip ? "chip-active" : ""}`}
                    onClick={() => handleChipSelect(chip)}
                    disabled={isTransitioning}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </>
          )}
          {done && (
            <div className="flex justify-center">
              <div className="flex items-center gap-3" style={{ color: "#8b95a7" }}>
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="rgba(14,165,160,0.3)"
                    strokeWidth="3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="#0ea5a0"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-sm font-body">Finalizing your profile…</span>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
