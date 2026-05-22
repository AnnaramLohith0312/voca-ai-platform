import { UserStage } from "../services/interfaces";

export interface StageDetectionResult {
  stage: UserStage | "unknown";
  confidence: number;
}

export function detectStage(firstAnswer: string): StageDetectionResult {
  const ans = firstAnswer.toLowerCase();
  
  if (!ans.trim() || ans.length < 2) {
    return { stage: "unknown", confidence: 0 };
  }

  let scores: Record<UserStage, number> = {
    class10: 0,
    plus1plus2: 0,
    undergraduate: 0,
    jobshift: 0,
  };

  // Class 10 heuristics
  if (ans.includes("class 10") || ans.includes("10th") || ans.includes("tenth")) scores.class10 += 2;
  if (ans.includes("school") && !ans.includes("high school")) scores.class10 += 1;

  // Plus 1/2 heuristics
  if (ans.includes("plus 1") || ans.includes("plus 2") || ans.includes("12th") || ans.includes("11th") || ans.includes("high school") || ans.includes("twelfth")) scores.plus1plus2 += 2;

  // UG heuristics
  if (ans.includes("ug") || ans.includes("undergrad") || ans.includes("college") || ans.includes("university") || ans.includes("degree") || ans.includes("bachelor")) scores.undergraduate += 2;
  if (ans.includes("student") && !ans.includes("school")) scores.undergraduate += 1;

  // Jobshift heuristics
  if (ans.includes("working") || ans.includes("shift") || ans.includes("pivot") || ans.includes("job") || ans.includes("professional") || ans.includes("career")) scores.jobshift += 2;
  if (ans.includes("experience")) scores.jobshift += 1;

  let maxScore = 0;
  let detectedStage: UserStage | "unknown" = "unknown";

  for (const [stage, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedStage = stage as UserStage;
    } else if (score === maxScore && score > 0) {
      // Contradiction / tie -> drop confidence
      detectedStage = "unknown";
    }
  }

  // Threshold check
  if (maxScore < 2) {
    return { stage: "unknown", confidence: maxScore * 0.5 };
  }

  return { stage: detectedStage, confidence: Math.min(1, maxScore * 0.5) };
}
