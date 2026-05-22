import { UserStage, ResultsPayload } from "../services/interfaces";

export type { UserStage, ResultsPayload };

export interface CareerSignals {
  stage: UserStage;
  interests: string[];
  academicPreferences: string[];
  subjectAffinity: string[];
  strengths: string[];
  workStyle: string[];
  learningStyle: string[];
  motivationDrivers: string[];
  collaborationPreference: string;
  creativityVsStructure: string;
  analyticalOrientation: string;
  communicationOrientation: string;
  technicalOrientation: string;
  leadershipInclination: string;
  problemPreference: string;
  careerGoals: string[];
  constraints: string[];
  confidenceScore: number;
  
  // Class 10 specific
  subjectComfort?: string;
  exploratoryOpenness?: string;
  streamInclination?: string;

  // Plus 1 / Plus 2 specific
  currentStream?: string;
  examOrientation?: string;
  degreeAspiration?: string;

  // Undergraduate specific
  degreeProgram?: string;
  specializationLeaning?: string;
  internshipProjectExposure?: string;
  employabilityReadiness?: string;

  // Job shift specific
  currentRole?: string;
  yearsOfExperience?: string;
  transferableSkills?: string[];
  transitionUrgency?: string;
  switchType?: string;
  incomeRiskConstraints?: string[];
}
