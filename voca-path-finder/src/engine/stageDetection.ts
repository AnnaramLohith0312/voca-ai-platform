import { UserStage } from "../services/interfaces";

export interface StageDetectionResult {
  stage: UserStage | "unknown";
  confidence: "high" | "medium" | "low";
}

export function detectStage(firstAnswer: string): StageDetectionResult {
  let ans = firstAnswer.toLowerCase().trim();
  ans = ans.replace(/[^\w\s]/g, "");
  
  if (!ans || ans.length < 2) {
    return { stage: "unknown", confidence: "low" };
  }

  let scores: Record<UserStage, number> = {
    class10: 0,
    plus1plus2: 0,
    undergraduate: 0,
    jobshift: 0,
  };

  // Class 10 heuristics
  if (/(class 10|10th|tenth|10th grade|10th standard|10th pass|after 10)/.test(ans)) scores.class10 += 3;
  if (/(school)/.test(ans) && !/(high school)/.test(ans)) scores.class10 += 1;
  if (/(completed 10th|just finished my 10th)/.test(ans)) scores.class10 += 3;

  // Plus 1/2 heuristics
  if (/(plus 1|plus 2|12th|11th|high school|twelfth|after 12th|after 12|completed 12th|12th pass|12th grade|after class 12|passed 12|12th standard)/.test(ans)) scores.plus1plus2 += 3;
  if (/(exploring after school|just finished school|school done)/.test(ans)) scores.plus1plus2 += 2;

  // UG heuristics
  if (/(ug|undergrad|college|university|degree|bachelor|btech|bsc|bcom|ba |first year college|second year college|third year|final year)/.test(ans)) scores.undergraduate += 3;
  if (/(student)/.test(ans) && !/(school)/.test(ans)) scores.undergraduate += 1;

  // Jobshift heuristics
  if (/(working|shift|pivot|job|professional|career change|employed|switching)/.test(ans)) scores.jobshift += 3;
  if (/(fresher|fresh graduate|just graduated|newly graduated)/.test(ans)) scores.jobshift += 2;
  if (/(experience)/.test(ans)) scores.jobshift += 1;

  let maxScore = 0;
  let detectedStage: UserStage | "unknown" = "unknown";

  for (const [stage, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedStage = stage as UserStage;
    } else if (score === maxScore && score > 0) {
      detectedStage = "unknown";
    }
  }

  if (detectedStage === "unknown") {
    return { stage: "unknown", confidence: "low" };
  }

  let confidence: "high" | "medium" | "low" = "low";
  if (maxScore >= 3) confidence = "high";
  else if (maxScore === 2) confidence = "medium";

  if (confidence === "low") {
    return { stage: "unknown", confidence: "low" };
  }

  return { stage: detectedStage, confidence };
}
