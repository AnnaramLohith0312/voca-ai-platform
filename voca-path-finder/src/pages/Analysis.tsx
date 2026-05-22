// src/pages/Analysis.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useVoca } from "@/contexts/VocaContext";
import type { AnalysisPhase } from "@/services/interfaces";

export default function Analysis() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    analysisStatus: status,
    analysisProgress: progressValue,
    analysisPhase: currentPhase,
    results,
  } = useVoca();

  const [displayedPhase, setDisplayedPhase] = useState<AnalysisPhase | null>(null);
  const [phaseVisible, setPhaseVisible] = useState(true);
  const [progressBarColor, setProgressBarColor] = useState("#0ea5a0");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (status === "complete" || results) {
      setProgressBarColor("#c99a43");
      const timer = setTimeout(() => {
        navigate("/results");
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === "error") {
      navigate("/onboarding");
    }
  }, [status, results, navigate]);

  useEffect(() => {
    if (currentPhase) {
      if (!displayedPhase || displayedPhase.title !== currentPhase.title) {
        setPhaseVisible(false);
        const timer = setTimeout(() => {
          setDisplayedPhase(currentPhase);
          setPhaseVisible(true);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentPhase, displayedPhase]);

  const displayTitle = status === "complete" ? "Analysis complete" : (displayedPhase?.title || "Reading your signals");
  const displaySubtitle = status === "complete" ? "Your career map is ready." : (displayedPhase?.subtitle || "Reviewing the answers you shared with us...");

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#0b0e12" }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 h-16 border-b border-white/[0.07] nav-bg">
        <span
          className="text-[24px] font-headline font-semibold tracking-tight"
          style={{ color: "#e8e9ec" }}
        >
          VOCA
        </span>
        {/* System Active pill */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-medium"
          style={{
            background: "rgba(14,165,160,0.10)",
            border: "1px solid rgba(14,165,160,0.20)",
            color: "#0ea5a0",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#0ea5a0" }}
          />
          System Active
        </div>
      </header>

      {/* Main centered content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-16">
        {/* Orbit ring + core */}
        <div className="relative flex items-center justify-center mb-12">
          {/* Outer orbit ring */}
          <div
            className="orbit-ring absolute"
            style={{ width: "320px", height: "320px" }}
          />
          {/* Middle ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: "220px",
              height: "220px",
              border: "1px solid rgba(14,165,160,0.08)",
            }}
          />
          {/* Core */}
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: "#171c24",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 0 40px rgba(14,165,160,0.12)",
            }}
          >
            {/* Circles SVG icon */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="14" cy="20" r="7" stroke="#0ea5a0" strokeWidth="1.5" fill="none" />
              <circle cx="26" cy="20" r="7" stroke="#0ea5a0" strokeWidth="1.5" fill="none" />
              <ellipse cx="20" cy="20" rx="3" ry="7" stroke="rgba(14,165,160,0.45)" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>

        {/* Status text block */}
        <div
          className="text-center"
          style={{
            opacity: phaseVisible ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <h1
            className="font-headline font-semibold text-[28px] mb-2"
            style={{ color: "#e8e9ec" }}
          >
            {displayTitle}
          </h1>
          <p className="font-body text-[15px] mb-8" style={{ color: "#8b95a7" }}>
            {displaySubtitle}
          </p>

          {/* Progress bar */}
          <div
            className="mx-auto progress-track"
            style={{ width: "240px", height: "2px" }}
          >
            <div
              className="progress-fill h-full"
              style={{
                width: `${progressValue}%`,
                background: progressBarColor,
                transition: "width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.5s ease",
              }}
            />
          </div>

          {status !== "complete" && (
            <p
              className="mt-6 text-xs font-body uppercase tracking-widest"
              style={{ color: "rgba(139,149,167,0.5)" }}
            >
              This usually takes a few seconds
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
