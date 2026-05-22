// src/models/results.ts

export type DbUserStage = "class10" | "plus1plus2" | "undergraduate" | "jobshift";

export interface DbSkillAlignment {
  skill: string;
  level: string;
  percentage: number;
  variant: "teal" | "red";
}

export interface DbAlternativePath {
  title: string;
  matchScore: number;
  description: string;
}

export interface DbCareerResult {
  title: string;
  category: string;
  matchScore: number;
  summary: string;
  rationale: { heading: string; body: string }[];
  skills: DbSkillAlignment[];
  strongestSignals: string[];
  improvementAreas: string[];
  improvementNote: string;
  priorities: string[];
  prioritiesNote: string;
  coreValues: { title: string; body: string }[];
  alternativePaths: DbAlternativePath[];
  whyRecommended: string;
}

export interface DbBaseResults {
  id: string;
  userId: string;
  generatedAt: string;
  stage: DbUserStage;
}

export interface DbClass10Results extends DbBaseResults {
  stage: "class10";
  recommendedStreams: { stream: string; matchScore: number; reason: string }[];
  broadClusters: { name: string; description: string }[];
  whyRecommended: string;
  skillsToBuild: string[];
  nextSteps: string[];
  cautions: string;
}

export interface DbPlus1Plus2Results extends DbBaseResults {
  stage: "plus1plus2";
  degreeDirections: { degree: string; why: string }[];
  matchingDomains: { domain: string; matchScore: number }[];
  roleClusters: string[];
  whyRecommended: string;
  nextSteps: string[];
  skillBuildingSuggestions: string[];
}

export interface DbUndergraduateResults extends DbBaseResults {
  stage: "undergraduate";
  primary: DbCareerResult;
  specializationSuggestions?: string[];
  internshipProjects?: string[];
  placementReadiness?: string;
}

export interface DbJobShiftResults extends DbBaseResults {
  stage: "jobshift";
  primary: DbCareerResult;
  transitionFeasibility: { score: number; difficulty: string; reason: string };
  transferableStrengths?: string[];
  upskillingRoadmap: { step: string; detail: string }[];
}

export type DbResults =
  | DbClass10Results
  | DbPlus1Plus2Results
  | DbUndergraduateResults
  | DbJobShiftResults;
