import { CareerSignals } from "./types";
import { ResultsPayload } from "../services/interfaces";

function normalizeInput(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");
}

function matchesAny(input: string, keywords: string[]): boolean {
  const norm = normalizeInput(input);
  return keywords.some((kw) => norm.includes(kw));
}

export function generateRecommendations(userId: string, signals: CareerSignals, answers: Record<string, string>): ResultsPayload {
  const generatedAt = new Date().toISOString();
  const id = `res_${userId}_${Date.now()}`;

  if (signals.stage === "class10") {
    // Stage A: Class 10 Student
    const favSubject = answers["What subjects do you enjoy most?"] || "Science & Math";
    const learningStyle = answers["How do you prefer to learn?"] || "Doing experiments and projects";
    
    let recommendedStreams = [
      { stream: "Science Stream (PCM/PCB)", matchScore: 92, reason: "Aligns with your love for logical reasoning and hands-on experiments." },
      { stream: "Interdisciplinary Design & Technology", matchScore: 85, reason: "Excellent choice for blending creative arts with digital tech." },
      { stream: "Commerce & Applied Economics", matchScore: 65, reason: "Good if you want to transition towards business leadership later." }
    ];

    let broadClusters = [
      { name: "Engineering & Applied Technology", description: "Designing, programming, and building software or hardware solutions." },
      { name: "Digital Design & Creative Media", description: "Creating visual stories, user experiences, and multi-media designs." }
    ];

    const artKeywords = ["art", "design", "creative", "media", "draw", "paint", "visual"];
    const bizKeywords = ["commerce", "business", "money", "finance", "manage", "sell", "marketing"];

    if (matchesAny(favSubject, artKeywords)) {
      recommendedStreams = [
        { stream: "Arts & Humanities with Creative Arts Elective", matchScore: 95, reason: "Perfect match for your strong creative drive and preference for visual learning." },
        { stream: "Interdisciplinary Design & Technology", matchScore: 90, reason: "Combines creative design instincts with modern technology tools." },
        { stream: "Commerce with Marketing focus", matchScore: 70, reason: "Applies creativity directly to business branding and entrepreneurial paths." }
      ];
      broadClusters = [
        { name: "Creative Arts, UX, & Communication", description: "Roles focusing on design systems, visual arts, communication, and human experiences." },
        { name: "Interdisciplinary Technology", description: "Blending creative front-end design with digital product building." }
      ];
    } else if (matchesAny(favSubject, bizKeywords)) {
      recommendedStreams = [
        { stream: "Commerce with Applied Economics & Math", matchScore: 94, reason: "Directly matches your interest in commerce, market logic, and numbers." },
        { stream: "Humanities with Economics & Business Studies", matchScore: 80, reason: "Offers a broader perspective on social sciences, policy, and market dynamics." },
        { stream: "Science (PCM) with Computer Science", matchScore: 75, reason: "Highly quantitative foundation useful for advanced finance and tech systems." }
      ];
      broadClusters = [
        { name: "Finance, Markets & Economics", description: "Analyzing business trends, managing investments, and developing corporate strategies." },
        { name: "Entrepreneurship & Product Leadership", description: "Identifying market needs, managing resources, and launching new initiatives." }
      ];
    }

    return {
      id,
      userId,
      generatedAt,
      stage: "class10",
      recommendedStreams,
      broadClusters,
      whyRecommended: `VOCA recommends exploring the ${recommendedStreams[0].stream} because your strongest signals indicate a high comfort with ${favSubject} and you learn best through ${learningStyle}. This stage is about exposing yourself to these concepts before committing.`,
      skillsToBuild: [
        "Computational Thinking (Scratch/Python basics)",
        "Visual Communication (Sketching/Figma)",
        "Structured Problem Solving",
        "Public Speaking & Presentation"
      ],
      nextSteps: [
        "Take a basic online course in Programming or UX Design",
        "Participate in Science or Design exhibitions in school",
        "Interview a professional working in tech or business",
        "Maintain a reading list of science, business, and design blogs"
      ],
      cautions: "Important: At this stage, your interests are highly fluid. Do not lock yourself into a hyper-specific career title (like 'AI Researcher' or 'Investment Banker') just yet. Focus on building broad foundations in logic, math, and communication."
    };
  }

  if (signals.stage === "plus1plus2") {
    // Stage B: Plus 1 / Plus 2 Student
    const stream = answers["What stream are you in currently?"] || "Science (PCM)";
    const careerInterest = answers["What kind of career domain excites you most?"] || "Technology / Engineering";

    let degreeDirections = [
      { degree: "Bachelor of Technology (B.Tech / BE) in CS/IT", why: "Strongest technical alignment for PCM students eyeing tech careers." },
      { degree: "Bachelor of Science (B.Sc) in Data Science / Mathematics", why: "For students interested in quantitative research and statistics." },
      { degree: "Bachelor of Design (B.Des) in Interaction Design", why: "For PCM students with a strong creative and aesthetic inclination." }
    ];

    let matchingDomains = [
      { domain: "Software Engineering & Computer Science", matchScore: 94 },
      { domain: "Data Analytics & Computational Modeling", matchScore: 85 },
      { domain: "Digital Product Management", matchScore: 78 }
    ];

    const bioKeywords = ["pcb", "bio", "medic", "doctor", "health", "science", "clinical"];
    const bizKeywords = ["commerce", "business", "finance", "money", "management", "corporate", "ca", "cfa"];

    if (matchesAny(stream, bioKeywords) || matchesAny(careerInterest, bioKeywords)) {
      degreeDirections = [
        { degree: "MBBS (Bachelor of Medicine, Bachelor of Surgery)", why: "The classic path to clinical medicine and surgery." },
        { degree: "B.Sc / B.Tech in Biotechnology / Genetics", why: "Bridging life sciences, research, and technical labs." },
        { degree: "B.Sc in Psychology or Cognitive Science", why: "For students fascinated by human behavior, mental health, and research." }
      ];
      matchingDomains = [
        { domain: "Clinical Medicine & Patient Care", matchScore: 92 },
        { domain: "Biotechnology Research & Genetics", matchScore: 88 },
        { domain: "Cognitive Sciences & Clinical Psychology", matchScore: 80 }
      ];
    } else if (matchesAny(stream, bizKeywords) || matchesAny(careerInterest, bizKeywords)) {
      degreeDirections = [
        { degree: "Bachelor of Commerce (B.Com Hons)", why: "Provides rigorous foundation in accountancy, corporate laws, and finance." },
        { degree: "Bachelor of Business Administration (BBA) in Finance", why: "Best for direct corporate management and entrepreneurship preparation." },
        { degree: "Chartered Accountancy (CA) / CFA Track", why: "For deep, specialized roles in corporate auditing and investment banking." }
      ];
      matchingDomains = [
        { domain: "Corporate Finance & Investment Banking", matchScore: 95 },
        { domain: "Business Analytics & Consulting", matchScore: 87 },
        { domain: "Startup Operations & Strategy", matchScore: 82 }
      ];
    }

    return {
      id,
      userId,
      generatedAt,
      stage: "plus1plus2",
      degreeDirections,
      matchingDomains,
      roleClusters: ["Software Engineers", "Data Analysts", "Product Specialists", "Systems Administrators"],
      whyRecommended: `Your background in ${stream} combined with an interest in ${careerInterest} suggests you are ready to target degree programs that lay a solid mathematical and logical foundation. The B.Tech/B.Sc paths offer the maximum versatility for your profile.`,
      nextSteps: [
        "Research entrance exam dates (JEE, SAT, UCEED, or state equivalents)",
        "Build 1-2 coding or design projects to add to your college applications",
        "Attend virtual open days for top-tier universities",
        "Take a career-interest diagnostic test for specific subjects"
      ],
      skillBuildingSuggestions: [
        "Learn Python or Javascript fundamentals",
        "Familiarize yourself with Figma or Canva for design basics",
        "Understand financial models (simple budgeting and cashflow analytics)",
        "Practice daily verbal reasoning and critical thinking exercises"
      ]
    };
  }

  if (signals.stage === "undergraduate") {
    // Stage C: Undergraduate Student
    const favPart = answers["What are your favorite parts of your studies?"] || "Technical coding/labs";
    const skill = answers["What do you consider your strongest skill?"] || "Coding / Technical implementation";

    let title = "Junior Software Engineer";
    let summary = "Develops, tests, and maintains modern web and mobile applications using structured codebases and APIs.";
    let skills = [
      { skill: "Software Engineering & Data Structures", level: "Intermediate", percentage: 75, variant: "teal" as const },
      { skill: "Web Application Development (React/TS)", level: "Advanced", percentage: 80, variant: "teal" as const },
      { skill: "Version Control & Git Pipelines", level: "Advanced", percentage: 82, variant: "teal" as const },
      { skill: "System Design & Databases", level: "Learning", percentage: 40, variant: "red" as const }
    ];

    const designKeywords = ["design", "ui", "ux", "creative", "art", "visual", "front-end", "interface"];
    const dataKeywords = ["data", "research", "analyze", "analytics", "statistics", "math", "machine learning"];

    if (matchesAny(favPart, designKeywords) || matchesAny(skill, designKeywords)) {
      title = "Junior UX/UI Designer";
      summary = "Focuses on crafting user journeys, wireframes, style guides, and high-fidelity mockups for digital products.";
      skills = [
        { skill: "UI/UX Design Systems & Figma", level: "Expert", percentage: 90, variant: "teal" as const },
        { skill: "User Research & Usability Testing", level: "Advanced", percentage: 78, variant: "teal" as const },
        { skill: "Interaction Design & Prototyping", level: "Advanced", percentage: 80, variant: "teal" as const },
        { skill: "HTML/CSS & Front-end Integration", level: "Learning", percentage: 45, variant: "red" as const }
      ];
    } else if (matchesAny(favPart, dataKeywords) || matchesAny(skill, dataKeywords)) {
      title = "Junior Data Analyst";
      summary = "Processes, analyzes, and visualizes complex datasets to extract business-critical insights and fuel dashboards.";
      skills = [
        { skill: "SQL Query Writing & Database Joins", level: "Expert", percentage: 88, variant: "teal" as const },
        { skill: "Data Visualization (Tableau/PowerBI)", level: "Advanced", percentage: 82, variant: "teal" as const },
        { skill: "Python Analytics (Pandas/NumPy)", level: "Advanced", percentage: 75, variant: "teal" as const },
        { skill: "Statistical Analysis & R", level: "Learning", percentage: 45, variant: "red" as const }
      ];
    }

    return {
      id,
      userId,
      generatedAt,
      stage: "undergraduate",
      primary: {
        title,
        category: "Primary Trajectory",
        matchScore: 92,
        summary,
        rationale: [
          { heading: "Skill Match", body: `Your strong performance in '${skill}' aligns perfectly with the day-to-day requirements of a ${title}.` },
          { heading: "Practical Preference", body: "Your desire to jump directly into building and deploying matches the high-agency mindset needed for entry-level engineering/design teams." }
        ],
        skills,
        strongestSignals: [favPart, skill],
        improvementAreas: ["System Design & Databases", "API Optimization"],
        improvementNote: "Deepening your system design concept knowledge will make you highly competitive for top placements.",
        priorities: ["Technical Growth", "Startup Agility"],
        prioritiesNote: "You thrive in high-paced environments that challenge your technical skills early in your career.",
        coreValues: [
          { title: "Rapid Execution", body: "Focusing on writing, shipping, and iterating code quickly." },
          { title: "Continuous Mentorship", body: "Working in teams with strong senior engineer supervision to learn best practices." }
        ],
        alternativePaths: [
          { title: "Systems Administrator", matchScore: 81, description: "Managing server clusters, cloud hosting, and networking logic." },
          { title: "Associate Product Manager", matchScore: 78, description: "Helping define features, prioritize backlogs, and run scrum meetings." }
        ],
        whyRecommended: `Your university specialization and interest in '${favPart}' make ${title} the most logical and practical launchpad for your career.`
      },
      specializationSuggestions: [
        "Full-Stack Web Development",
        "Cloud Infrastructure (AWS/GCP)",
        "Mobile App Engineering"
      ],
      internshipProjects: [
        "Build a fully functioning e-commerce API and connect it to a React frontend",
        "Contribute to open-source libraries in your favorite tech stack"
      ],
      placementReadiness: "Medium-High. Focus on system design questions and mock technical interviews to lock in top offers."
    };
  }

  // Stage D: Job Shift
  const currentField = answers["What field are you currently working in?"] || "Software / IT";
  const switchType = answers["What type of career transition are you looking for?"] || "Move to adjacent domain";
  const asset = answers["What is your strongest transferable asset?"] || "Technical skills (code/systems)";

  let title = "AI Solutions Engineer";
  let summary = "Leverages software background and systems engineering expertise to integrate agentic AI pipelines and custom LLM interfaces for enterprise operations.";
  let skills = [
    { skill: "System Architecture", level: "Expert", percentage: 92, variant: "teal" as const },
    { skill: "APIs & Web Service Integration", level: "Expert", percentage: 90, variant: "teal" as const },
    { skill: "AI Agent Orchestration (LangChain)", level: "Advanced", percentage: 76, variant: "teal" as const },
    { skill: "UI Layouts & Design Systems", level: "Learning", percentage: 50, variant: "red" as const }
  ];

  const stratKeywords = ["people", "strategy", "manage", "product", "lead", "business", "vision", "communication", "soft skills"];

  if (matchesAny(asset, stratKeywords)) {
    title = "AI Product Manager";
    summary = "Bridges the gap between engineering feasibility and business strategy, managing modern agentic workflows.";
    skills = [
      { skill: "Product Strategy & Vision", level: "Expert", percentage: 94, variant: "teal" as const },
      { skill: "Cross-functional Collaboration", level: "Expert", percentage: 92, variant: "teal" as const },
      { skill: "AI/ML Systems Architecture", level: "Advanced", percentage: 80, variant: "teal" as const },
      { skill: "Rapid Prototyping", level: "Learning", percentage: 48, variant: "red" as const }
    ];
  }

  return {
    id,
    userId,
    generatedAt,
    stage: "jobshift",
    primary: {
      title,
      category: "Primary Trajectory",
      matchScore: 94,
      summary,
      rationale: [
        { heading: "Transferable Asset Utilisation", body: `Your strong command of '${asset}' translates directly to the design and oversight requirements of an ${title}.` },
        { heading: "Calculated Shift", body: `A transition of type '${switchType}' allows you to leverage past credentials in ${currentField} while breaking into high-demand AI implementation roles.` }
      ],
      skills,
      strongestSignals: [currentField, asset, switchType],
      improvementAreas: ["Machine Learning Fine-Tuning", "GPU Infrastructure Management"],
      improvementNote: "Taking courses in deep learning operations (MLOps) will help secure senior roles in this space.",
      priorities: ["Growth Trajectory", "High Autonomy"],
      prioritiesNote: "You are looking to escape stagnation and enter a domain with high-impact responsibilities.",
      coreValues: [
        { title: "Exponential Growth", body: "Direct positioning in high-velocity tech segments." },
        { title: "Creative Autonomy", body: "High level of individual decision-making in technical execution." }
      ],
      alternativePaths: [
        { title: "Lead Software Architect", matchScore: 86, description: "Focusing heavily on backend systems and scalability." },
        { title: "Technical Consultant", matchScore: 82, description: "Designing tech integrations for diverse enterprise clients." }
      ],
      whyRecommended: `This path leverages your ${currentField} background while pivoting towards the highest growing technology category of the decade.`
    },
    transitionFeasibility: {
      score: 85,
      difficulty: "Moderate",
      reason: "Your years of experience give you the structural maturity needed. You only need to bridge specialized technical skills in AI agent frameworks."
    },
    transferableStrengths: [
      "Software Design Principles",
      "API Integrations",
      "Team Leadership & Mentorship"
    ],
    upskillingRoadmap: [
      { step: "Phase 1: Foundation", detail: "Complete intermediate certifications in LLM orchestration, Prompt Engineering, and Vector Databases." },
      { step: "Phase 2: Project Build", detail: "Build 2 functional agentic tools showing retrieval augmented generation (RAG) and host them publicly on GitHub." },
      { step: "Phase 3: Network & Apply", detail: "Connect with Engineering Directors in AI-first startups and present your portfolio projects." }
    ]
  };
}
