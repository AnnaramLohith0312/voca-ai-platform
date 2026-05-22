/**
 * VOCA Recommendation Engine
 * ──────────────────────────────────────────────────────────────────
 * Scores every career in the dataset against the user's onboarding
 * signals and returns a ranked, stage-filtered result payload.
 *
 * Scoring logic (0-100):
 *   +25  keyword match (answers contain career keywords)
 *   +20  subject affinity match
 *   +20  stage relevance match
 *   +15  traits / work-style match
 *   +10  stream match (for school-stage users)
 *   +10  domain interest match
 */

import { CareerSignals } from "./types";
import { ResultsPayload } from "../services/interfaces";
import { CAREER_DATASET, CareerEntry } from "./careerDataset";

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalizeInput(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");
}

function matchesAny(input: string, keywords: string[]): boolean {
  const norm = normalizeInput(input);
  return keywords.some((kw) => norm.includes(normalizeInput(kw)));
}

function allAnswersText(answers: Record<string, string>): string {
  return Object.values(answers).join(" ");
}

// ─── Scoring ────────────────────────────────────────────────────────────────

function scoreCareer(
  career: CareerEntry,
  signals: CareerSignals,
  answers: Record<string, string>
): number {
  let score = 0;
  const combinedAnswers = allAnswersText(answers);

  // 1. Keyword match — up to 25 pts
  const kwMatches = career.keywords.filter((kw) =>
    matchesAny(combinedAnswers, [kw])
  ).length;
  score += Math.min(25, Math.round((kwMatches / career.keywords.length) * 25));

  // 2. Subject affinity — up to 20 pts
  const subjectMatches = career.subjectAffinity.filter((sub) =>
    signals.subjectAffinity?.some((s) => matchesAny(s, [sub])) ||
    matchesAny(combinedAnswers, [sub])
  ).length;
  score += Math.min(20, Math.round((subjectMatches / Math.max(career.subjectAffinity.length, 1)) * 20));

  // 3. Stage relevance — up to 20 pts
  if (career.stages.includes(signals.stage)) {
    score += 20;
  }

  // 4. Traits / orientation match — up to 15 pts
  let traitScore = 0;
  if (signals.technicalOrientation === "High" && career.traits.some(t => matchesAny(t, ["technical", "analytical", "logical", "systematic"]))) traitScore += 5;
  if (signals.creativityVsStructure === "Creativity" && career.traits.some(t => matchesAny(t, ["creative", "expressive", "visual", "storyteller"]))) traitScore += 5;
  if (signals.leadershipInclination === "High" && career.traits.some(t => matchesAny(t, ["leadership", "lead", "manage", "organiser"]))) traitScore += 5;
  if (signals.analyticalOrientation === "High" && career.traits.some(t => matchesAny(t, ["analytical", "research", "data", "methodical"]))) traitScore += 5;
  if (signals.communicationOrientation === "High" && career.traits.some(t => matchesAny(t, ["communicator", "social", "empathetic", "persuasive"]))) traitScore += 5;
  score += Math.min(15, traitScore);

  // 5. Stream match for school-stage users — up to 10 pts
  if ((signals.stage === "class10" || signals.stage === "plus1plus2") && signals.currentStream && career.streams) {
    if (career.streams.some(s => matchesAny(signals.currentStream!, [s]))) {
      score += 10;
    }
  }

  // 6. Domain interest match — up to 10 pts
  const domainKeywords: Record<string, string[]> = {
    "Engineering & Technology": ["tech", "engineering", "coding", "software", "build", "computer"],
    "Business & Finance": ["business", "finance", "money", "commerce", "manage", "marketing"],
    "Arts & Design": ["art", "design", "creative", "visual", "media", "fashion"],
    "Medicine & Healthcare": ["health", "medicine", "doctor", "biology", "care", "science"],
    "Defence & Civil Services": ["army", "defence", "military", "navy", "airforce", "government", "ias", "police", "uniform"],
    "Research & Academia": ["research", "science", "lab", "study", "phd", "academia"],
    "Law & Policy": ["law", "policy", "legal", "court", "justice", "governance"],
    "Education": ["teach", "education", "school", "mentor", "learning"],
    "Media & Communication": ["media", "writing", "journalism", "communication", "content", "storytell"],
    "Social Impact": ["social", "community", "impact", "ngo", "environment", "welfare"],
  };
  const domKws = domainKeywords[career.domain] ?? [];
  if (domKws.some((kw) => matchesAny(combinedAnswers, [kw]))) {
    score += 10;
  }

  return Math.min(100, score);
}

// ─── Skill Variants ─────────────────────────────────────────────────────────

function buildSkillBars(career: CareerEntry, signals: CareerSignals) {
  return career.skills.slice(0, 4).map((skill, i) => ({
    skill,
    level: i === 0 ? "Advanced" : i === 1 ? "Intermediate" : "Learning",
    percentage: Math.max(40, 90 - i * 15),
    variant: (i < 2 ? "teal" : "red") as "teal" | "red",
  }));
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function generateRecommendations(
  userId: string,
  signals: CareerSignals,
  answers: Record<string, string>
): ResultsPayload {
  const generatedAt = new Date().toISOString();
  const id = `res_${userId}_${Date.now()}`;

  // Score all careers against this user's signals
  const scoredCareers = CAREER_DATASET.map((career) => ({
    career,
    score: scoreCareer(career, signals, answers),
  }))
    .filter((sc) => sc.career.stages.includes(signals.stage))  // only stage-relevant
    .sort((a, b) => b.score - a.score);                         // highest score first

  const top = scoredCareers.slice(0, 5);   // top 5 careers
  const primary = top[0];
  const alternates = top.slice(1, 4);      // next 3 as alternatives

  if (!primary) {
    // Absolute fallback — no careers matched
    return { id, userId, generatedAt, stage: signals.stage, primary: null };
  }

  // ── School / Class 10 output ──────────────────────────────────────
  if (signals.stage === "class10") {
    const topDomains = [...new Set(top.map(sc => sc.career.domain))].slice(0, 3);

    return {
      id,
      userId,
      generatedAt,
      stage: "class10",
      recommendedStreams: top.slice(0, 3).flatMap(sc =>
        (sc.career.streams ?? []).map(stream => ({
          stream,
          matchScore: sc.score,
          reason: sc.career.summary,
        }))
      ).slice(0, 3),
      broadClusters: topDomains.map(domain => ({
        name: domain,
        description: `Careers like ${scoredCareers.filter(sc => sc.career.domain === domain).slice(0, 2).map(sc => sc.career.title).join(", ")} fit your profile.`,
      })),
      careerMatches: top.map(sc => ({
        title: sc.career.title,
        domain: sc.career.domain,
        matchScore: sc.score,
        summary: sc.career.summary,
        entryPaths: sc.career.entryPaths,
      })),
      whyRecommended: `Based on your interests and strengths, VOCA identified strong signals towards ${topDomains[0]}. Focus on building broad foundations first before committing.`,
      skillsToBuild: primary.career.skills.slice(0, 4),
      nextSteps: primary.career.entryPaths.slice(0, 3),
      cautions: "At this stage, keep your options open. These are directions, not final decisions.",
    };
  }

  // ── Plus 1 / Plus 2 output ────────────────────────────────────────
  if (signals.stage === "plus1plus2") {
    return {
      id,
      userId,
      generatedAt,
      stage: "plus1plus2",
      degreeDirections: top.slice(0, 3).map(sc => ({
        degree: sc.career.degreeOptions[0] ?? "Relevant degree program",
        why: sc.career.summary,
      })),
      matchingDomains: top.map(sc => ({
        domain: sc.career.domain + " — " + sc.career.title,
        matchScore: sc.score,
      })),
      roleClusters: top.map(sc => sc.career.title),
      careerMatches: top.map(sc => ({
        title: sc.career.title,
        domain: sc.career.domain,
        matchScore: sc.score,
        summary: sc.career.summary,
        entryPaths: sc.career.entryPaths,
        salaryBand: sc.career.salaryBand,
      })),
      whyRecommended: `Your stream and career interests point strongly towards ${primary.career.domain}. ${primary.career.title} is your strongest match at ${primary.score}% fit.`,
      nextSteps: primary.career.entryPaths,
      skillBuildingSuggestions: primary.career.skills,
    };
  }

  // ── Undergraduate output ──────────────────────────────────────────
  if (signals.stage === "undergraduate") {
    return {
      id,
      userId,
      generatedAt,
      stage: "undergraduate",
      primary: {
        title: primary.career.title,
        category: "Primary Trajectory",
        matchScore: primary.score,
        summary: primary.career.summary,
        rationale: [
          {
            heading: "Skill Match",
            body: `Your strongest signals align with the ${primary.career.sector} sector where ${primary.career.title} is a core role.`,
          },
          {
            heading: "Domain Fit",
            body: `Your interest profile fits ${primary.career.domain}, and this role has a growth score of ${primary.career.growthScore}/100 in the current market.`,
          },
        ],
        skills: buildSkillBars(primary.career, signals),
        strongestSignals: signals.strengths ?? [],
        improvementAreas: primary.career.improvementAreas.slice(0, 2),
        improvementNote: `Focusing on ${primary.career.improvementAreas[0]} will make you significantly more competitive for top roles.`,
        priorities: signals.motivationDrivers?.slice(0, 2) ?? ["Growth", "Impact"],
        prioritiesNote: "These motivators align well with your primary career trajectory.",
        coreValues: [
          { title: "Career Growth", body: `${primary.career.title} roles offer a salary band of ${primary.career.salaryBand}.` },
          { title: "Market Demand", body: `This field has a market growth score of ${primary.career.growthScore}/100.` },
        ],
        alternativePaths: alternates.map(sc => ({
          title: sc.career.title,
          matchScore: sc.score,
          description: sc.career.summary,
        })),
        whyRecommended: `Your profile from the onboarding conversation matches the requirements of a ${primary.career.title} most strongly across ${Object.keys(answers).length} evaluated dimensions.`,
      },
      careerMatches: top.map(sc => ({
        title: sc.career.title,
        domain: sc.career.domain,
        matchScore: sc.score,
        summary: sc.career.summary,
        salaryBand: sc.career.salaryBand,
        entryPaths: sc.career.entryPaths,
      })),
      specializationSuggestions: primary.career.degreeOptions,
      internshipProjects: [
        `Build a portfolio project demonstrating ${primary.career.skills[0]}`,
        `Intern at a company in the ${primary.career.sector} sector`,
      ],
      placementReadiness: primary.score > 75
        ? "High. You show strong alignment — focus on interview preparation."
        : "Medium. Strengthen your skills in " + primary.career.improvementAreas[0] + " to improve placement odds.",
    };
  }

  // ── Job Shift output ──────────────────────────────────────────────
  return {
    id,
    userId,
    generatedAt,
    stage: "jobshift",
    primary: {
      title: primary.career.title,
      category: "Primary Trajectory",
      matchScore: primary.score,
      summary: primary.career.summary,
      rationale: [
        {
          heading: "Transferable Strengths",
          body: `Your background and transferable assets align well with what ${primary.career.title} roles require.`,
        },
        {
          heading: "Market Opportunity",
          body: `${primary.career.domain} has a growth score of ${primary.career.growthScore}/100, making this an opportune time to pivot.`,
        },
      ],
      skills: buildSkillBars(primary.career, signals),
      strongestSignals: signals.strengths ?? [],
      improvementAreas: primary.career.improvementAreas.slice(0, 2),
      improvementNote: `Bridging the gap in ${primary.career.improvementAreas[0]} will accelerate your transition significantly.`,
      priorities: signals.motivationDrivers?.slice(0, 2) ?? ["Growth", "Autonomy"],
      prioritiesNote: "Your stated motivators match well with what this career path offers.",
      coreValues: [
        { title: "Income Potential", body: `Target salary band: ${primary.career.salaryBand}.` },
        { title: "Growth Trajectory", body: `Market growth score: ${primary.career.growthScore}/100.` },
      ],
      alternativePaths: alternates.map(sc => ({
        title: sc.career.title,
        matchScore: sc.score,
        description: sc.career.summary,
      })),
      whyRecommended: `${primary.career.title} leverages your existing experience while opening high-growth career opportunities in ${primary.career.domain}.`,
    },
    careerMatches: top.map(sc => ({
      title: sc.career.title,
      domain: sc.career.domain,
      matchScore: sc.score,
      summary: sc.career.summary,
      salaryBand: sc.career.salaryBand,
      entryPaths: sc.career.entryPaths,
    })),
    transitionFeasibility: {
      score: Math.min(95, primary.score + 10),
      difficulty: primary.score > 75 ? "Low-Moderate" : primary.score > 55 ? "Moderate" : "High",
      reason: `Your profile has a ${primary.score}% alignment with this role. ${primary.score > 65 ? "The transition is feasible with targeted upskilling." : "A structured transition plan over 6-12 months is recommended."}`,
    },
    transferableStrengths: signals.strengths?.slice(0, 3) ?? primary.career.skills.slice(0, 2),
    upskillingRoadmap: [
      { step: "Phase 1: Foundation", detail: `Build proficiency in: ${primary.career.improvementAreas.join(", ")}.` },
      { step: "Phase 2: Portfolio", detail: `Complete ${primary.career.entryPaths[0]} to demonstrate transition readiness.` },
      { step: "Phase 3: Apply", detail: `Target companies in the ${primary.career.sector} sector that value career changers.` },
    ],
  };
}
