// src/services/interfaces.ts

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
}

export interface AuthResult {
  user: AuthUser;
}

export interface IAuthService {
  signUpWithEmail(email: string, password: string, displayName: string): Promise<AuthResult>;
  signInWithEmail(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
  getCurrentUser(): AuthUser | null;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
}

export interface OnboardingAnswer {
  question: string;
  answer: string;
}

export interface OnboardingSession {
  userId: string;
  answers: OnboardingAnswer[];
  completedAt: string;
}

export interface IOnboardingService {
  saveSession(userId: string, answers: OnboardingAnswer[]): Promise<void>;
  getSession(userId: string): Promise<OnboardingSession | null>;
  clearSession(userId: string): Promise<void>;
}

export type AnalysisStatus = "idle" | "pending" | "processing" | "complete" | "error";

export interface AnalysisJob {
  analysisId: string;
  userId: string;
  status: AnalysisStatus;
  startedAt: string;
  completedAt?: string;
  answers: OnboardingAnswer[];
}

export interface AnalysisPhase {
  title: string;
  subtitle: string;
  progress: number;
}

export interface IAnalysisService {
  startAnalysis(userId: string, answers: OnboardingAnswer[]): Promise<AnalysisJob>;
  getStatus(userId: string): Promise<AnalysisStatus>;
  getJobProgress(userId: string): Promise<{
    status: AnalysisStatus;
    progress: number;
    currentPhase: AnalysisPhase | null;
  }>;
  getJob(userId: string): Promise<AnalysisJob | null>;
  clearJob(userId: string): Promise<void>;
}

export type UserStage = "class10" | "plus1plus2" | "undergraduate" | "jobshift";

export interface SkillAlignment {
  skill: string;
  level: string;
  percentage: number;
  variant: "teal" | "red";
}

export interface AlternativePath {
  title: string;
  matchScore: number;
  description: string;
}

export interface CareerResult {
  title: string;
  category: string;
  matchScore: number;
  summary: string;
  rationale: { heading: string; body: string }[];
  skills: SkillAlignment[];
  strongestSignals: string[];
  improvementAreas: string[];
  improvementNote: string;
  priorities: string[];
  prioritiesNote: string;
  coreValues: { title: string; body: string }[];
  alternativePaths: AlternativePath[];
  whyRecommended: string;
}

export interface BaseResultsPayload {
  id: string;
  userId: string;
  generatedAt: string;
  stage: UserStage;
}

export interface Class10ResultsPayload extends BaseResultsPayload {
  stage: "class10";
  recommendedStreams: { stream: string; matchScore: number; reason: string }[];
  broadClusters: { name: string; description: string }[];
  whyRecommended: string;
  skillsToBuild: string[];
  nextSteps: string[];
  cautions: string;
}

export interface Plus1Plus2ResultsPayload extends BaseResultsPayload {
  stage: "plus1plus2";
  degreeDirections: { degree: string; why: string }[];
  matchingDomains: { domain: string; matchScore: number }[];
  roleClusters: string[];
  whyRecommended: string;
  nextSteps: string[];
  skillBuildingSuggestions: string[];
}

export interface UndergraduateResultsPayload extends BaseResultsPayload {
  stage: "undergraduate";
  primary: CareerResult;
  specializationSuggestions: string[];
  internshipProjects: string[];
  placementReadiness: string;
}

export interface JobShiftResultsPayload extends BaseResultsPayload {
  stage: "jobshift";
  primary: CareerResult;
  transitionFeasibility: { score: number; difficulty: string; reason: string };
  transferableStrengths?: string[];
  upskillingRoadmap: { step: string; detail: string }[];
}

export type ResultsPayload =
  | Class10ResultsPayload
  | Plus1Plus2ResultsPayload
  | UndergraduateResultsPayload
  | JobShiftResultsPayload;

export interface IResultsService {
  generateResults(userId: string, answers: Record<string, string>): Promise<ResultsPayload>;
  getResults(userId: string): Promise<ResultsPayload | null>;
  clearResults(userId: string): Promise<void>;
}

