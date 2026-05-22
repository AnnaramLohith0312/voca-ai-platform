import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { onboardingService } from "@/services/onboardingService";
import { resultsService } from "@/services/resultsService";
import { analysisService } from "@/services/analysisService";
import type { OnboardingAnswer } from "@/services/interfaces";
import type { ResultsPayload } from "@/services/interfaces";
import type { AnalysisPhase } from "@/services/interfaces";

export type AppFlowStatus = "idle" | "onboarding" | "analysis" | "results";

interface VocaState {
  flowStatus: AppFlowStatus;
  onboardingAnswers: OnboardingAnswer[];
  onboardingComplete: boolean;
  analysisStatus: "idle" | "processing" | "complete" | "error";
  results: ResultsPayload | null;
  loading: boolean;
  analysisProgress: number;
  analysisPhase: AnalysisPhase | null;
}

interface VocaContextValue extends VocaState {
  saveAnswer: (answer: OnboardingAnswer) => void;
  completeOnboarding: (answers: OnboardingAnswer[], signals?: any) => Promise<void>;
  setAnalysisStatus: (status: VocaState["analysisStatus"]) => void;
  setResults: (payload: ResultsPayload) => void;
  resetFlow: () => Promise<void>;
  // Convenience: answers as a map for service calls
  answersMap: Record<string, string>;
}

const initialState: VocaState = {
  flowStatus: "idle",
  onboardingAnswers: [],
  onboardingComplete: false,
  analysisStatus: "idle",
  results: null,
  loading: true,
  analysisProgress: 0,
  analysisPhase: null,
};

const VocaContext = createContext<VocaContextValue | null>(null);

export function VocaProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VocaState>(initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setState((prev) => ({ ...prev, loading: true }));
      Promise.all([
        onboardingService.getSession(user.uid),
        resultsService.getResults(user.uid),
      ])
        .then(([session, resultsPayload]) => {
          setState((prev) => ({
            ...prev,
            onboardingAnswers: session ? session.answers : [],
            onboardingComplete: !!session,
            results: resultsPayload,
            flowStatus: resultsPayload ? "results" : session ? "analysis" : "onboarding",
            loading: false,
          }));
        })
        .catch(() => {
          setState((prev) => ({ ...prev, loading: false }));
        });
    } else {
      // User logged out, reset state
      setState({
        ...initialState,
        loading: false,
      });
    }
  }, [user]);

  // Polling effect for analysis
  useEffect(() => {
    if (!user || state.flowStatus !== "analysis") {
      return;
    }

    let isSubscribed = true;
    let intervalId: NodeJS.Timeout | null = null;

    const poll = async () => {
      try {
        // Double check job status or start if not present
        const job = await analysisService.getJob(user.uid);
        if (!job || job.status === "complete") {
          await analysisService.startAnalysis(user.uid, state.onboardingAnswers);
        }

        const progressInfo = await analysisService.getJobProgress(user.uid);
        if (!isSubscribed) return;

        setState((prev) => ({
          ...prev,
          analysisStatus: progressInfo.status === "complete" ? "complete" : (progressInfo.status === "error" ? "error" : "processing"),
          analysisProgress: progressInfo.progress,
          analysisPhase: progressInfo.currentPhase,
        }));

        if (progressInfo.status === "complete") {
          if (intervalId) clearInterval(intervalId);
          const resultsPayload = await resultsService.getResults(user.uid);
          if (!isSubscribed) return;

          setState((prev) => ({
            ...prev,
            results: resultsPayload,
            flowStatus: "results",
            onboardingComplete: true,
          }));
        } else if (progressInfo.status === "error") {
          if (intervalId) clearInterval(intervalId);
          setState((prev) => ({
            ...prev,
            flowStatus: "onboarding",
            analysisStatus: "error",
          }));
        }
      } catch (err) {
        if (!isSubscribed) return;
        setState((prev) => ({
          ...prev,
          analysisStatus: "error",
        }));
      }
    };

    // Run immediately, then start interval
    poll();
    intervalId = setInterval(poll, 400);

    return () => {
      isSubscribed = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, state.flowStatus, state.onboardingAnswers]);

  const saveAnswer = useCallback((answer: OnboardingAnswer) => {
    setState((prev) => ({
      ...prev,
      onboardingAnswers: [...prev.onboardingAnswers, answer],
    }));
  }, []);

  const completeOnboarding = useCallback(
    async (answers: OnboardingAnswer[], signals?: any) => {
      if (user) {
        await onboardingService.saveSession(user.uid, answers);
        if (signals) {
          localStorage.setItem(`voca_signals_${user.uid}`, JSON.stringify(signals));
        }
      }
      setState((prev) => ({
        ...prev,
        onboardingAnswers: answers,
        onboardingComplete: true,
        flowStatus: "analysis",
      }));
    },
    [user]
  );

  const setAnalysisStatus = useCallback((status: VocaState["analysisStatus"]) => {
    setState((prev) => ({
      ...prev,
      analysisStatus: status,
      flowStatus: status === "complete" ? "results" : prev.flowStatus,
    }));
  }, []);

  const setResults = useCallback((payload: ResultsPayload) => {
    setState((prev) => ({
      ...prev,
      results: payload,
      flowStatus: "results",
    }));
  }, []);

  const resetFlow = useCallback(async () => {
    if (user) {
      await onboardingService.clearSession(user.uid);
      await resultsService.clearResults(user.uid);
      await analysisService.clearJob(user.uid);
      localStorage.removeItem(`voca_signals_${user.uid}`);
    }
    setState({
      ...initialState,
      loading: false,
    });
  }, [user]);

  const answersMap = state.onboardingAnswers.reduce<Record<string, string>>(
    (acc, a) => ({ ...acc, [a.question]: a.answer }),
    {}
  );

  return (
    <VocaContext.Provider
      value={{
        ...state,
        saveAnswer,
        completeOnboarding,
        setAnalysisStatus,
        setResults,
        resetFlow,
        answersMap,
      }}
    >
      {children}
    </VocaContext.Provider>
  );
}

export function useVoca(): VocaContextValue {
  const ctx = useContext(VocaContext);
  if (!ctx) throw new Error("useVoca must be used within <VocaProvider>");
  return ctx;
}
