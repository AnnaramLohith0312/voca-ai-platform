/**
 * VOCA Career Dataset
 * ──────────────────────────────────────────────────────────────────
 * A comprehensive, structured dataset of career paths across all
 * major domains. Each entry defines the career's attributes which
 * the recommendation engine uses to compute match scores from a
 * user's onboarding signals.
 *
 * Fields:
 *  id            – Unique slug
 *  title         – Display name
 *  domain        – Top-level domain bucket
 *  sector        – Sub-sector within domain
 *  summary       – One-line description shown on results card
 *  keywords      – Terms matched against user answers (normalised)
 *  subjectAffinity – Academic subjects that align
 *  traits        – Personality / work-style traits that fit
 *  skills        – Core skills required
 *  stages        – Which user stages this career is relevant for
 *  streams       – Which Class 10/12 streams lead here (if any)
 *  degreeOptions – Relevant degrees
 *  entryPaths    – How to enter (exam, portfolio, direct, etc.)
 *  growthScore   – Market demand score 0-100
 *  salaryBand    – Indicative INR/year band (India context)
 *  improvementAreas – Skills the user typically needs to build
 *  alternativeTitles – Related roles shown as "Alternative Paths"
 */

export interface CareerEntry {
  id: string;
  title: string;
  domain: CareerDomain;
  sector: string;
  summary: string;
  keywords: string[];
  subjectAffinity: string[];
  traits: string[];
  skills: string[];
  stages: string[];
  streams?: string[];
  degreeOptions: string[];
  entryPaths: string[];
  growthScore: number;
  salaryBand: string;
  improvementAreas: string[];
  alternativeTitles: string[];
}

export type CareerDomain =
  | "Engineering & Technology"
  | "Business & Finance"
  | "Arts & Design"
  | "Medicine & Healthcare"
  | "Defence & Civil Services"
  | "Research & Academia"
  | "Law & Policy"
  | "Education"
  | "Media & Communication"
  | "Social Impact";

export const CAREER_DATASET: CareerEntry[] = [

  // ─────────────────────────────────────────────────────────────────
  // ENGINEERING & TECHNOLOGY
  // ─────────────────────────────────────────────────────────────────
  {
    id: "software-engineer",
    title: "Software Engineer",
    domain: "Engineering & Technology",
    sector: "Software Development",
    summary: "Designs, builds, and maintains software applications and systems at scale.",
    keywords: ["coding", "programming", "software", "tech", "developer", "build", "code", "engineering", "computer science"],
    subjectAffinity: ["Mathematics", "Computer Science", "Physics", "Science & Math"],
    traits: ["analytical", "problem solver", "structured", "logical"],
    skills: ["Programming (Python/Java/JS)", "Data Structures & Algorithms", "System Design", "Version Control (Git)"],
    stages: ["undergraduate", "plus1plus2", "jobshift"],
    streams: ["Science (PCM)"],
    degreeOptions: ["B.Tech CS/IT", "B.Sc Computer Science", "BCA"],
    entryPaths: ["Campus placement", "FAANG/product company interviews", "Bootcamp + portfolio"],
    growthScore: 97,
    salaryBand: "₹6L – ₹40L+/yr",
    improvementAreas: ["System Design", "Cloud Architecture", "DSA depth"],
    alternativeTitles: ["Backend Engineer", "Full-Stack Developer", "DevOps Engineer"]
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    domain: "Engineering & Technology",
    sector: "Data & AI",
    summary: "Uses statistical models and ML to extract insights and build predictive systems.",
    keywords: ["data", "machine learning", "statistics", "analytics", "ai", "python", "math", "research", "ml", "deep learning"],
    subjectAffinity: ["Mathematics", "Statistics", "Science & Math", "Computer Science"],
    traits: ["analytical", "research-oriented", "curious", "methodical"],
    skills: ["Python (Pandas/NumPy/scikit-learn)", "SQL", "Machine Learning", "Statistical Analysis", "Data Visualization"],
    stages: ["undergraduate", "jobshift"],
    streams: ["Science (PCM)"],
    degreeOptions: ["B.Tech CS/IT", "B.Sc Mathematics/Statistics", "M.Sc Data Science"],
    entryPaths: ["Kaggle competitions", "Internships", "Postgraduate specialization"],
    growthScore: 95,
    salaryBand: "₹8L – ₹45L+/yr",
    improvementAreas: ["Deep Learning", "MLOps", "Experiment Design"],
    alternativeTitles: ["ML Engineer", "AI Researcher", "Data Analyst"]
  },
  {
    id: "ai-ml-engineer",
    title: "AI / ML Engineer",
    domain: "Engineering & Technology",
    sector: "Artificial Intelligence",
    summary: "Builds and deploys machine learning models and AI-powered production systems.",
    keywords: ["ai", "machine learning", "deep learning", "neural network", "nlp", "llm", "tensorflow", "pytorch", "artificial intelligence"],
    subjectAffinity: ["Mathematics", "Computer Science", "Physics"],
    traits: ["curious", "research-driven", "technical", "systematic"],
    skills: ["Deep Learning", "PyTorch/TensorFlow", "MLOps", "Python", "Math for ML"],
    stages: ["undergraduate", "jobshift"],
    streams: ["Science (PCM)"],
    degreeOptions: ["B.Tech CS/AI", "M.Tech AI/ML", "B.Sc Mathematics+CS"],
    entryPaths: ["Research internships", "AI product companies", "Open-source contributions"],
    growthScore: 98,
    salaryBand: "₹12L – ₹80L+/yr",
    improvementAreas: ["Mathematics depth", "Research paper reading", "GPU Infrastructure"],
    alternativeTitles: ["Deep Learning Engineer", "NLP Engineer", "Computer Vision Engineer"]
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    domain: "Engineering & Technology",
    sector: "Security",
    summary: "Protects digital infrastructure from threats, breaches, and vulnerabilities.",
    keywords: ["security", "cyber", "hacking", "network", "defense", "ethical hacking", "infosec", "penetration"],
    subjectAffinity: ["Computer Science", "Mathematics", "Science & Math"],
    traits: ["vigilant", "problem solver", "detail-oriented", "strategic"],
    skills: ["Network Security", "Penetration Testing", "SIEM Tools", "Cryptography", "Incident Response"],
    stages: ["undergraduate", "jobshift"],
    streams: ["Science (PCM)"],
    degreeOptions: ["B.Tech CS/IT", "B.Sc Cybersecurity", "CEH/OSCP Certifications"],
    entryPaths: ["CTF competitions", "Bug bounty programs", "Security certifications"],
    growthScore: 96,
    salaryBand: "₹5L – ₹35L+/yr",
    improvementAreas: ["Cloud Security", "Reverse Engineering", "Malware Analysis"],
    alternativeTitles: ["Ethical Hacker", "SOC Analyst", "Security Engineer"]
  },
  {
    id: "mechanical-engineer",
    title: "Mechanical Engineer",
    domain: "Engineering & Technology",
    sector: "Core Engineering",
    summary: "Designs, analyzes, and manufactures mechanical systems and devices.",
    keywords: ["mechanical", "machines", "manufacturing", "automobile", "design", "physics", "thermodynamics", "robotics", "build"],
    subjectAffinity: ["Physics", "Mathematics", "Science & Math"],
    traits: ["hands-on", "analytical", "systematic", "curious about how things work"],
    skills: ["CAD (SolidWorks/AutoCAD)", "Thermodynamics", "Manufacturing Processes", "FEA/Simulation"],
    stages: ["undergraduate", "plus1plus2"],
    streams: ["Science (PCM)"],
    degreeOptions: ["B.Tech Mechanical Engineering", "BE Mechanical"],
    entryPaths: ["Campus placements", "GATE exam for PSUs", "Automotive/aerospace companies"],
    growthScore: 78,
    salaryBand: "₹4L – ₹25L/yr",
    improvementAreas: ["Robotics & Automation", "Industry 4.0", "CAD expertise"],
    alternativeTitles: ["Automotive Engineer", "Robotics Engineer", "Manufacturing Engineer"]
  },
  {
    id: "civil-engineer",
    title: "Civil Engineer",
    domain: "Engineering & Technology",
    sector: "Infrastructure",
    summary: "Plans and oversees construction of buildings, bridges, roads, and infrastructure.",
    keywords: ["civil", "construction", "infrastructure", "building", "structure", "concrete", "architecture", "roads", "bridges"],
    subjectAffinity: ["Physics", "Mathematics", "Science & Math"],
    traits: ["methodical", "leadership", "outdoor/field work", "project management"],
    skills: ["Structural Analysis", "AutoCAD/Revit", "Project Management", "Surveying"],
    stages: ["undergraduate", "plus1plus2"],
    streams: ["Science (PCM)"],
    degreeOptions: ["B.Tech/BE Civil Engineering"],
    entryPaths: ["UPSC ESE exam", "Campus placements", "Government PSU jobs"],
    growthScore: 75,
    salaryBand: "₹4L – ₹20L/yr",
    improvementAreas: ["BIM/Revit skills", "Smart city tech", "Project cost management"],
    alternativeTitles: ["Structural Engineer", "Urban Planner", "Construction Manager"]
  },
  {
    id: "electrical-engineer",
    title: "Electrical Engineer",
    domain: "Engineering & Technology",
    sector: "Core Engineering",
    summary: "Designs and develops electrical systems, power grids, and electronic components.",
    keywords: ["electrical", "electronics", "circuit", "power", "energy", "signal", "embedded", "iot", "automation"],
    subjectAffinity: ["Physics", "Mathematics", "Science & Math"],
    traits: ["precise", "technical", "systematic", "detail-oriented"],
    skills: ["Circuit Design", "Power Systems", "Embedded C", "MATLAB", "PLC Programming"],
    stages: ["undergraduate", "plus1plus2"],
    streams: ["Science (PCM)"],
    degreeOptions: ["B.Tech EEE/ECE"],
    entryPaths: ["GATE exam", "Campus placements", "Core industry PSUs"],
    growthScore: 76,
    salaryBand: "₹4L – ₹22L/yr",
    improvementAreas: ["Renewable energy systems", "IoT", "Power electronics"],
    alternativeTitles: ["Electronics Engineer", "Power Systems Engineer", "Embedded Systems Engineer"]
  },
  {
    id: "product-manager",
    title: "Product Manager",
    domain: "Engineering & Technology",
    sector: "Product Management",
    summary: "Owns the product vision, roadmap, and cross-functional execution for tech products.",
    keywords: ["product", "strategy", "roadmap", "lead", "manage", "vision", "user", "business", "tech", "agile", "scrum"],
    subjectAffinity: ["Business", "Computer Science", "Economics"],
    traits: ["strategic", "communicator", "leadership", "empathetic", "data-driven"],
    skills: ["Product Strategy", "Agile/Scrum", "Data Analysis", "User Research", "Stakeholder Communication"],
    stages: ["undergraduate", "jobshift"],
    degreeOptions: ["B.Tech + MBA", "BBA + Product experience", "Any degree + PM certification"],
    entryPaths: ["Associate PM programs (Google, Microsoft)", "MBA transition", "Internal transitions"],
    growthScore: 94,
    salaryBand: "₹12L – ₹60L+/yr",
    improvementAreas: ["Technical depth", "Metrics/SQL", "Go-to-market strategy"],
    alternativeTitles: ["Technical Product Manager", "Growth Product Manager", "Product Owner"]
  },
  {
    id: "cloud-architect",
    title: "Cloud Solutions Architect",
    domain: "Engineering & Technology",
    sector: "Cloud & Infrastructure",
    summary: "Designs and manages scalable cloud infrastructure on AWS, GCP, or Azure.",
    keywords: ["cloud", "aws", "azure", "gcp", "devops", "infrastructure", "servers", "kubernetes", "docker"],
    subjectAffinity: ["Computer Science", "Mathematics"],
    traits: ["systematic", "technical", "problem solver", "strategic"],
    skills: ["AWS/Azure/GCP", "Docker & Kubernetes", "Terraform (IaC)", "Networking", "Security"],
    stages: ["undergraduate", "jobshift"],
    degreeOptions: ["B.Tech CS/IT", "AWS/GCP Certifications"],
    entryPaths: ["Cloud certifications", "DevOps engineer → Architect path", "Startup infrastructure roles"],
    growthScore: 96,
    salaryBand: "₹15L – ₹60L+/yr",
    improvementAreas: ["FinOps", "Multi-cloud strategy", "Security architecture"],
    alternativeTitles: ["DevOps Engineer", "Site Reliability Engineer", "Platform Engineer"]
  },

  // ─────────────────────────────────────────────────────────────────
  // BUSINESS & FINANCE
  // ─────────────────────────────────────────────────────────────────
  {
    id: "investment-banker",
    title: "Investment Banker",
    domain: "Business & Finance",
    sector: "Finance",
    summary: "Advises companies on mergers, acquisitions, IPOs, and capital raising deals.",
    keywords: ["finance", "banking", "investment", "money", "commerce", "business", "equity", "markets", "deals", "wall street"],
    subjectAffinity: ["Commerce", "Business Studies", "Economics", "Mathematics"],
    traits: ["ambitious", "analytical", "competitive", "high-pressure tolerance"],
    skills: ["Financial Modeling", "Valuation (DCF, Comps)", "Excel/PowerPoint", "Negotiation", "M&A process"],
    stages: ["undergraduate", "plus1plus2", "jobshift"],
    streams: ["Commerce", "Science (PCM)"],
    degreeOptions: ["B.Com", "BBA Finance", "B.Tech + MBA Finance", "CA/CFA"],
    entryPaths: ["IIM/Top B-School MBA", "CA + finance experience", "CFA certification"],
    growthScore: 88,
    salaryBand: "₹15L – ₹1Cr+/yr",
    improvementAreas: ["Financial modeling depth", "M&A experience", "CFA Level 1-3"],
    alternativeTitles: ["Equity Research Analyst", "Venture Capitalist", "Corporate Finance Manager"]
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur / Startup Founder",
    domain: "Business & Finance",
    sector: "Entrepreneurship",
    summary: "Identifies opportunities and builds ventures from scratch across any industry.",
    keywords: ["startup", "entrepreneur", "business", "founder", "idea", "build", "venture", "innovate", "own", "create"],
    subjectAffinity: ["Business", "Commerce", "Any"],
    traits: ["risk-taking", "visionary", "resilient", "self-motivated", "leadership"],
    skills: ["Business Model Design", "Fundraising", "Marketing", "Operations", "Leadership"],
    stages: ["undergraduate", "plus1plus2", "jobshift", "class10"],
    streams: ["Commerce", "Science (PCM)", "Humanities/Arts"],
    degreeOptions: ["Any degree", "MBA", "Self-taught experience"],
    entryPaths: ["Bootstrap", "Incubators (IIT/IIM)", "Angel funding", "Hackathons"],
    growthScore: 85,
    salaryBand: "Variable (₹0 – ₹Unlimited)",
    improvementAreas: ["Financial literacy", "Sales skills", "Product-market fit validation"],
    alternativeTitles: ["Co-founder", "Intrapreneur", "Social Entrepreneur"]
  },
  {
    id: "chartered-accountant",
    title: "Chartered Accountant (CA)",
    domain: "Business & Finance",
    sector: "Accounting & Audit",
    summary: "Manages financial records, audits, taxation, and compliance for organisations.",
    keywords: ["commerce", "accounts", "finance", "tax", "audit", "ca", "icai", "money", "business", "number"],
    subjectAffinity: ["Commerce", "Mathematics", "Business Studies", "Economics"],
    traits: ["detail-oriented", "diligent", "numerical", "trustworthy"],
    skills: ["Financial Accounting", "Taxation (GST/Income Tax)", "Auditing", "Tally/SAP", "Company Law"],
    stages: ["plus1plus2", "undergraduate", "class10"],
    streams: ["Commerce"],
    degreeOptions: ["CA (ICAI)", "B.Com + CA", "CPA (for international)"],
    entryPaths: ["CA Foundation → Intermediate → Final", "Articleship training"],
    growthScore: 84,
    salaryBand: "₹8L – ₹50L+/yr",
    improvementAreas: ["International taxation", "Data analytics for finance", "IFRS"],
    alternativeTitles: ["Cost Accountant (CMA)", "Tax Consultant", "CFO track"]
  },
  {
    id: "management-consultant",
    title: "Management Consultant",
    domain: "Business & Finance",
    sector: "Consulting",
    summary: "Helps organisations solve complex business problems and improve performance.",
    keywords: ["consulting", "strategy", "business", "management", "problem solving", "analytics", "mckinsey", "bcg", "bain"],
    subjectAffinity: ["Business", "Economics", "Mathematics", "Any"],
    traits: ["structured thinker", "communicator", "analytical", "client-facing"],
    skills: ["Problem Structuring (MECE)", "Data Analysis", "Presentation", "Business Strategy", "Project Management"],
    stages: ["undergraduate", "jobshift"],
    degreeOptions: ["MBA (IIM/ISB)", "B.Tech + MBA", "B.Com + MBA"],
    entryPaths: ["Top MBA programs", "Campus placements at MBB firms", "Industry experience → MBA"],
    growthScore: 90,
    salaryBand: "₹12L – ₹80L+/yr",
    improvementAreas: ["Industry specialization", "Excel/PPT mastery", "Client relationship skills"],
    alternativeTitles: ["Strategy Analyst", "Business Analyst", "Operations Consultant"]
  },
  {
    id: "marketing-manager",
    title: "Marketing Manager / Growth Lead",
    domain: "Business & Finance",
    sector: "Marketing",
    summary: "Plans and executes campaigns, brand strategy, and growth initiatives.",
    keywords: ["marketing", "brand", "social media", "creative", "growth", "communication", "advertising", "digital", "campaign"],
    subjectAffinity: ["Business", "Commerce", "Languages", "Economics"],
    traits: ["creative", "communicator", "data-driven", "social", "trend-aware"],
    skills: ["Digital Marketing (SEO/SEM/Social)", "Copywriting", "Analytics (GA4)", "Brand Strategy", "CRM"],
    stages: ["undergraduate", "plus1plus2", "jobshift"],
    streams: ["Commerce", "Humanities/Arts"],
    degreeOptions: ["BBA Marketing", "B.Com", "MBA Marketing", "B.Design"],
    entryPaths: ["Internships at agencies/startups", "Digital marketing certifications", "Content creation portfolio"],
    growthScore: 88,
    salaryBand: "₹5L – ₹35L+/yr",
    improvementAreas: ["Performance marketing", "Attribution modeling", "AI tools for marketing"],
    alternativeTitles: ["Digital Marketing Specialist", "Brand Manager", "Growth Hacker"]
  },
  {
    id: "human-resources",
    title: "HR Manager / People Operations",
    domain: "Business & Finance",
    sector: "Human Resources",
    summary: "Manages talent acquisition, employee experience, and organisational culture.",
    keywords: ["people", "hr", "human resources", "team", "manage", "culture", "interview", "recruit", "leadership", "empathy"],
    subjectAffinity: ["Business", "Psychology", "Humanities", "Social Studies"],
    traits: ["empathetic", "communicator", "leader", "organiser"],
    skills: ["Recruitment", "Employee Engagement", "HRIS Systems", "Labour Laws", "Training & Development"],
    stages: ["undergraduate", "jobshift"],
    degreeOptions: ["MBA HR", "BBA HR", "B.A Psychology + MBA"],
    entryPaths: ["HR internships", "MBA HR specialization", "SHRM/PHR certifications"],
    growthScore: 78,
    salaryBand: "₹5L – ₹30L+/yr",
    improvementAreas: ["HR Analytics", "Diversity & Inclusion", "Compensation strategy"],
    alternativeTitles: ["Talent Acquisition Specialist", "HRBP", "Learning & Development Manager"]
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTS & DESIGN
  // ─────────────────────────────────────────────────────────────────
  {
    id: "ux-designer",
    title: "UX/UI Designer",
    domain: "Arts & Design",
    sector: "Digital Design",
    summary: "Crafts intuitive user experiences and visual interfaces for digital products.",
    keywords: ["design", "ui", "ux", "creative", "visual", "interface", "figma", "art", "user experience", "prototype"],
    subjectAffinity: ["Arts", "Computer Science", "Psychology"],
    traits: ["creative", "empathetic", "visual thinker", "user-centric"],
    skills: ["Figma/Sketch", "User Research", "Wireframing", "Interaction Design", "Prototyping"],
    stages: ["undergraduate", "plus1plus2", "jobshift"],
    streams: ["Science (PCM)", "Humanities/Arts", "Commerce"],
    degreeOptions: ["B.Des", "B.Tech + Design minor", "NID/NIFT programs"],
    entryPaths: ["Design portfolio", "UCEED/CEED entrance", "Online certification + freelance"],
    growthScore: 90,
    salaryBand: "₹5L – ₹35L+/yr",
    improvementAreas: ["Motion design", "Design systems", "Accessibility standards"],
    alternativeTitles: ["Product Designer", "Interaction Designer", "Visual Designer"]
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    domain: "Arts & Design",
    sector: "Visual Communication",
    summary: "Creates visual content for branding, advertising, and digital media.",
    keywords: ["graphic", "design", "art", "illustrate", "visual", "brand", "photoshop", "creative", "media", "draw"],
    subjectAffinity: ["Arts", "Fine Arts", "Design"],
    traits: ["creative", "aesthetic sense", "detail-oriented", "expressive"],
    skills: ["Adobe Photoshop/Illustrator", "Typography", "Branding", "Color Theory", "Print & Digital Design"],
    stages: ["undergraduate", "plus1plus2", "class10", "jobshift"],
    streams: ["Humanities/Arts", "Vocational"],
    degreeOptions: ["B.Des Graphic Design", "NIFT/NID", "B.FA", "Diploma in Design"],
    entryPaths: ["Portfolio showcase", "Freelancing", "Design agencies", "Social media presence"],
    growthScore: 82,
    salaryBand: "₹3L – ₹20L+/yr (freelance higher)",
    improvementAreas: ["Motion graphics", "3D design", "UI/UX crossover skills"],
    alternativeTitles: ["Brand Designer", "Art Director", "Illustrator"]
  },
  {
    id: "film-media",
    title: "Film Director / Video Content Creator",
    domain: "Arts & Design",
    sector: "Film & Media",
    summary: "Creates, directs, and produces films, web series, and digital content.",
    keywords: ["film", "movie", "video", "creative", "storytell", "director", "content", "media", "art", "script"],
    subjectAffinity: ["Arts", "Languages", "Social Studies"],
    traits: ["creative", "storyteller", "visionary", "communicator"],
    skills: ["Storytelling", "Direction & Cinematography", "Video Editing (Premiere/DaVinci)", "Scriptwriting", "Production Management"],
    stages: ["undergraduate", "plus1plus2", "class10", "jobshift"],
    streams: ["Humanities/Arts"],
    degreeOptions: ["FTII", "Symbiosis School of Media", "B.A Mass Communication", "Self-taught"],
    entryPaths: ["Short films portfolio", "YouTube channel", "Film school entrance", "Internships"],
    growthScore: 80,
    salaryBand: "₹3L – ₹50L+/yr (highly variable)",
    improvementAreas: ["OTT content trends", "Visual effects basics", "Pitching skills"],
    alternativeTitles: ["Cinematographer", "YouTube Creator", "Screenwriter"]
  },
  {
    id: "architect",
    title: "Architect",
    domain: "Arts & Design",
    sector: "Architecture",
    summary: "Designs buildings and spaces, balancing aesthetics, function, and engineering.",
    keywords: ["architecture", "design", "building", "space", "art", "create", "civil", "construct", "draw", "structure"],
    subjectAffinity: ["Arts", "Mathematics", "Physics", "Design"],
    traits: ["creative", "spatial thinker", "detail-oriented", "patient"],
    skills: ["AutoCAD/Revit", "3D Modelling (SketchUp/Rhino)", "Building Codes", "Design History", "Structural Basics"],
    stages: ["undergraduate", "plus1plus2"],
    streams: ["Science (PCM)", "Humanities/Arts"],
    degreeOptions: ["B.Arch (5-year)", "NATA entrance exam"],
    entryPaths: ["NATA exam", "Architecture college portfolio", "Internship at design firms"],
    growthScore: 78,
    salaryBand: "₹4L – ₹25L+/yr",
    improvementAreas: ["Sustainable design", "Interior design crossover", "BIM software"],
    alternativeTitles: ["Interior Designer", "Urban Planner", "Landscape Architect"]
  },
  {
    id: "fashion-designer",
    title: "Fashion Designer",
    domain: "Arts & Design",
    sector: "Fashion",
    summary: "Creates clothing, accessories, and textile collections for brands and consumers.",
    keywords: ["fashion", "design", "clothing", "art", "creative", "style", "textile", "costume", "brand", "aesthetics"],
    subjectAffinity: ["Arts", "Design", "Home Science"],
    traits: ["creative", "trend-aware", "aesthetic", "entrepreneurial"],
    skills: ["Pattern Making", "Textile Knowledge", "Fashion Illustration", "Adobe Illustrator", "Trend Forecasting"],
    stages: ["undergraduate", "plus1plus2", "class10"],
    streams: ["Humanities/Arts", "Vocational"],
    degreeOptions: ["B.Des Fashion (NIFT)", "B.Sc Fashion Design"],
    entryPaths: ["NIFT entrance exam", "Portfolio building", "Internships at fashion houses"],
    growthScore: 75,
    salaryBand: "₹3L – ₹20L+/yr",
    improvementAreas: ["Sustainable fashion", "Digital fashion tech", "Business of fashion"],
    alternativeTitles: ["Costume Designer", "Stylist", "Textile Designer"]
  },

  // ─────────────────────────────────────────────────────────────────
  // MEDICINE & HEALTHCARE
  // ─────────────────────────────────────────────────────────────────
  {
    id: "doctor-mbbs",
    title: "Medical Doctor (MBBS)",
    domain: "Medicine & Healthcare",
    sector: "Clinical Medicine",
    summary: "Diagnoses and treats patients, providing comprehensive clinical care.",
    keywords: ["doctor", "medicine", "health", "hospital", "patient", "clinical", "biology", "science", "care", "mbbs"],
    subjectAffinity: ["Biology", "Chemistry", "Science & Math", "Physics"],
    traits: ["empathetic", "disciplined", "analytical", "pressure-resistant"],
    skills: ["Clinical Diagnosis", "Patient Communication", "Anatomy", "Pharmacology", "Medical Ethics"],
    stages: ["plus1plus2", "undergraduate"],
    streams: ["Science (PCB)"],
    degreeOptions: ["MBBS", "BDS (Dentistry)", "BAMS/BHMS"],
    entryPaths: ["NEET-UG exam", "Medical college admissions"],
    growthScore: 90,
    salaryBand: "₹8L – ₹60L+/yr (specialist)",
    improvementAreas: ["Specialization (MD/MS)", "Research skills", "Digital health knowledge"],
    alternativeTitles: ["Specialist Doctor", "Surgeon", "General Practitioner"]
  },
  {
    id: "biotech-researcher",
    title: "Biotechnology Researcher",
    domain: "Medicine & Healthcare",
    sector: "Biotech & Life Sciences",
    summary: "Conducts research using biological systems to develop medical and industrial solutions.",
    keywords: ["biotech", "biology", "research", "genetics", "lab", "science", "pharma", "drug", "life science", "molecular"],
    subjectAffinity: ["Biology", "Chemistry", "Science & Math"],
    traits: ["curious", "patient", "analytical", "research-oriented"],
    skills: ["Molecular Biology techniques", "Cell Culture", "PCR/Gel Electrophoresis", "Bioinformatics", "Research Writing"],
    stages: ["plus1plus2", "undergraduate", "jobshift"],
    streams: ["Science (PCB)"],
    degreeOptions: ["B.Tech Biotechnology", "B.Sc Genetics/Microbiology", "M.Sc Biotechnology"],
    entryPaths: ["Research internships", "Government CSIR labs", "Pharma companies", "PhD programs"],
    growthScore: 85,
    salaryBand: "₹4L – ₹25L+/yr",
    improvementAreas: ["Bioinformatics/Computational Biology", "Clinical trials knowledge", "IP & patents"],
    alternativeTitles: ["Pharmaceutical Researcher", "Clinical Research Associate", "Bioinformatics Scientist"]
  },
  {
    id: "psychologist",
    title: "Clinical Psychologist",
    domain: "Medicine & Healthcare",
    sector: "Mental Health",
    summary: "Assesses and treats mental health conditions through therapeutic interventions.",
    keywords: ["psychology", "mental health", "therapy", "counseling", "human", "behavior", "mind", "emotion", "wellbeing"],
    subjectAffinity: ["Psychology", "Biology", "Social Studies", "Humanities"],
    traits: ["empathetic", "good listener", "patient", "non-judgmental", "analytical"],
    skills: ["Psychological Assessment", "CBT/DBT Therapy", "Report Writing", "Counseling", "Research Methods"],
    stages: ["plus1plus2", "undergraduate", "jobshift"],
    streams: ["Science (PCB)", "Humanities/Arts"],
    degreeOptions: ["B.Sc Psychology", "B.A Psychology + M.A/M.Sc Psychology", "M.Phil Clinical Psychology (RCI)"],
    entryPaths: ["RCI-recognized programs", "Hospital internships", "Private practice"],
    growthScore: 86,
    salaryBand: "₹4L – ₹25L+/yr",
    improvementAreas: ["Specialized therapy modalities", "Neuropsychology", "Teletherapy platforms"],
    alternativeTitles: ["Counselor", "School Psychologist", "Behavioral Therapist"]
  },
  {
    id: "nurse",
    title: "Nurse / Nursing Professional",
    domain: "Medicine & Healthcare",
    sector: "Healthcare",
    summary: "Provides patient care, medication, and support in hospitals and healthcare settings.",
    keywords: ["nurse", "nursing", "hospital", "patient care", "health", "medicine", "care", "biology"],
    subjectAffinity: ["Biology", "Chemistry"],
    traits: ["compassionate", "diligent", "calm under pressure", "teamwork"],
    skills: ["Patient Assessment", "Medication Administration", "Emergency Care", "Documentation"],
    stages: ["plus1plus2", "undergraduate"],
    streams: ["Science (PCB)"],
    degreeOptions: ["B.Sc Nursing", "GNM (General Nursing & Midwifery)", "M.Sc Nursing"],
    entryPaths: ["NEET / State nursing entrance", "Nursing college admissions"],
    growthScore: 85,
    salaryBand: "₹3L – ₹15L+/yr (international ₹30L+)",
    improvementAreas: ["Critical care specialization", "International nursing exams (NCLEX)", "Nurse practitioner path"],
    alternativeTitles: ["Pediatric Nurse", "ICU Specialist Nurse", "Community Health Nurse"]
  },

  // ─────────────────────────────────────────────────────────────────
  // DEFENCE & CIVIL SERVICES
  // ─────────────────────────────────────────────────────────────────
  {
    id: "indian-army-officer",
    title: "Indian Army Officer",
    domain: "Defence & Civil Services",
    sector: "Indian Army",
    summary: "Leads troops, defends the nation, and manages military operations on the ground.",
    keywords: ["army", "defence", "military", "soldier", "leadership", "nation", "patriot", "nda", "uniform", "physical", "combat", "ground"],
    subjectAffinity: ["Science & Math", "Social Studies", "History", "Physical Education"],
    traits: ["leadership", "disciplined", "physically fit", "brave", "team-oriented", "patriotic"],
    skills: ["Leadership", "Tactical Decision Making", "Physical Fitness", "Weapons Handling", "Team Management"],
    stages: ["class10", "plus1plus2", "undergraduate"],
    streams: ["Science (PCM)", "Humanities/Arts", "Commerce"],
    degreeOptions: ["NDA (after 12th)", "CDS (after graduation)", "TES (Technical Entry Scheme for PCM)"],
    entryPaths: ["NDA written exam + SSB Interview", "CDS exam + SSB", "TES entry for engineers"],
    growthScore: 92,
    salaryBand: "₹6L – ₹25L+/yr (+ perks & allowances)",
    improvementAreas: ["SSB interview preparation", "Physical fitness & NDA exam prep", "Leadership case studies"],
    alternativeTitles: ["Infantry Officer", "Artillery Officer", "Signals Officer"]
  },
  {
    id: "indian-navy-officer",
    title: "Indian Navy Officer",
    domain: "Defence & Civil Services",
    sector: "Indian Navy",
    summary: "Commands naval vessels, oversees maritime operations, and defends sea borders.",
    keywords: ["navy", "naval", "maritime", "sea", "ship", "defence", "military", "officer", "uniform", "patriot", "ocean"],
    subjectAffinity: ["Physics", "Mathematics", "Science & Math"],
    traits: ["disciplined", "adventurous", "leadership", "technically inclined", "brave"],
    skills: ["Naval Operations", "Navigation", "Engineering Systems (for technical branch)", "Leadership", "Communication"],
    stages: ["class10", "plus1plus2", "undergraduate"],
    streams: ["Science (PCM)"],
    degreeOptions: ["NDA Naval Wing (after 12th)", "CDS Navy (after graduation)", "B.Tech via Naval Academy"],
    entryPaths: ["NDA exam + SSB", "CDS exam + SSB", "Direct entry for engineers"],
    growthScore: 90,
    salaryBand: "₹7L – ₹28L+/yr (+ perks)",
    improvementAreas: ["Physical fitness", "SSB preparation", "Naval engineering knowledge"],
    alternativeTitles: ["Naval Engineer", "Submarine Officer", "Naval Aviator"]
  },
  {
    id: "indian-airforce-officer",
    title: "Indian Air Force Officer / Pilot",
    domain: "Defence & Civil Services",
    sector: "Indian Air Force",
    summary: "Operates military aircraft, defends airspace, and conducts aerial operations.",
    keywords: ["airforce", "air force", "pilot", "flying", "aircraft", "aviation", "defence", "military", "sky", "uniform", "patriot"],
    subjectAffinity: ["Physics", "Mathematics", "Science & Math"],
    traits: ["disciplined", "physically fit", "sharp reflexes", "leadership", "calm under pressure", "brave"],
    skills: ["Aircraft Operation", "Navigation", "Aerodynamics", "Quick Decision Making", "Physical Fitness"],
    stages: ["class10", "plus1plus2", "undergraduate"],
    streams: ["Science (PCM)"],
    degreeOptions: ["NDA Air Wing (after 12th)", "CDS Air Force (graduation)", "AFCAT exam"],
    entryPaths: ["NDA exam + SSB + Medical", "AFCAT exam", "Flying branch selection"],
    growthScore: 92,
    salaryBand: "₹8L – ₹30L+/yr (+ perks)",
    improvementAreas: ["Physics & Math for NDA", "Physical fitness", "AFCAT/SSB preparation"],
    alternativeTitles: ["Fighter Pilot", "Transport Pilot", "Air Traffic Controller (ATC)"]
  },
  {
    id: "ias-ips-officer",
    title: "IAS / IPS Officer (Civil Services)",
    domain: "Defence & Civil Services",
    sector: "Civil Services",
    summary: "Administers public services, implements government policy, and maintains law and order.",
    keywords: ["ias", "ips", "upsc", "civil services", "government", "policy", "administration", "public service", "irs", "ifs", "bureaucrat"],
    subjectAffinity: ["History", "Social Studies", "Political Science", "Geography", "Economics", "Any"],
    traits: ["disciplined", "analytical", "communicator", "public servant", "leadership", "integrity"],
    skills: ["Public Administration", "Policy Analysis", "Report Writing", "General Knowledge", "Law basics"],
    stages: ["undergraduate", "jobshift"],
    degreeOptions: ["Any graduation degree (UPSC requires any bachelor's degree)"],
    entryPaths: ["UPSC CSE exam (Prelims → Mains → Interview)", "State PCS exams"],
    growthScore: 94,
    salaryBand: "₹7L – ₹20L/yr (+ perks & power)",
    improvementAreas: ["Current affairs", "Optional subject mastery", "Answer writing skills", "Ethics"],
    alternativeTitles: ["State PCS Officer", "SDM", "DM / District Collector"]
  },
  {
    id: "police-officer",
    title: "Police Officer / IPS Officer",
    domain: "Defence & Civil Services",
    sector: "Law Enforcement",
    summary: "Maintains public order, investigates crimes, and enforces law at local or national level.",
    keywords: ["police", "law", "enforce", "crime", "investigation", "security", "uniform", "government", "ips", "order"],
    subjectAffinity: ["Social Studies", "History", "Political Science", "Law"],
    traits: ["disciplined", "brave", "physically fit", "quick decision-maker", "integrity"],
    skills: ["Investigation", "Physical Fitness", "Law Knowledge", "Communication", "Leadership"],
    stages: ["undergraduate", "plus1plus2"],
    degreeOptions: ["Any graduation degree", "LLB for legal branch", "B.Sc Forensics"],
    entryPaths: ["UPSC for IPS", "State police recruitment exams", "SSC CPO for central services"],
    growthScore: 85,
    salaryBand: "₹5L – ₹20L/yr (+ perks)",
    improvementAreas: ["Physical fitness", "Legal knowledge", "UPSC/state exam preparation"],
    alternativeTitles: ["Sub-Inspector", "DSP", "CBI/Intelligence Officer"]
  },
  {
    id: "paramilitary-officer",
    title: "Paramilitary Officer (CRPF / BSF / CISF)",
    domain: "Defence & Civil Services",
    sector: "Paramilitary",
    summary: "Serves in central armed police forces protecting borders, critical assets, and VIPs.",
    keywords: ["paramilitary", "crpf", "bsf", "cisf", "itbp", "defence", "security", "border", "uniform", "armed"],
    subjectAffinity: ["Physical Education", "Social Studies", "Science"],
    traits: ["physically fit", "disciplined", "brave", "loyal", "team-oriented"],
    skills: ["Physical Fitness", "Weapons Handling", "Patrolling", "First Aid", "Communication"],
    stages: ["plus1plus2", "undergraduate"],
    streams: ["Any"],
    degreeOptions: ["12th pass (for constable)", "Graduate (for ASI/SI)", "UPSC for Group A Officers"],
    entryPaths: ["SSC CPO", "UPSC CAPF exam", "Direct recruitment for constable posts"],
    growthScore: 83,
    salaryBand: "₹4L – ₹18L/yr (+ allowances)",
    improvementAreas: ["Physical fitness", "UPSC CAPF preparation", "Leadership"],
    alternativeTitles: ["BSF Constable", "CISF Inspector", "ITBP Officer"]
  },

  // ─────────────────────────────────────────────────────────────────
  // LAW & POLICY
  // ─────────────────────────────────────────────────────────────────
  {
    id: "lawyer",
    title: "Lawyer / Advocate",
    domain: "Law & Policy",
    sector: "Legal Practice",
    summary: "Represents clients in legal matters, provides counsel, and argues cases in court.",
    keywords: ["law", "lawyer", "legal", "court", "debate", "argue", "justice", "rights", "advocate", "clat", "constitution"],
    subjectAffinity: ["Social Studies", "History", "Political Science", "English", "Languages"],
    traits: ["argumentative", "logical", "communicator", "ethical", "persistent"],
    skills: ["Legal Research", "Contract Drafting", "Argumentation", "Case Analysis", "Client Counseling"],
    stages: ["plus1plus2", "undergraduate", "jobshift"],
    streams: ["Humanities/Arts", "Commerce", "Science (PCM)"],
    degreeOptions: ["BA.LLB (5 year integrated)", "LLB (3 year after graduation)", "CLAT entrance"],
    entryPaths: ["CLAT/AILET exam for NLUs", "State law university admissions"],
    growthScore: 85,
    salaryBand: "₹4L – ₹60L+/yr (partner level)",
    improvementAreas: ["Corporate law specialization", "International law", "Legal tech"],
    alternativeTitles: ["Corporate Lawyer", "Public Prosecutor", "Legal Consultant"]
  },
  {
    id: "policy-analyst",
    title: "Policy Analyst / Public Policy Professional",
    domain: "Law & Policy",
    sector: "Public Policy",
    summary: "Analyses and shapes government policies on social, economic, and environmental issues.",
    keywords: ["policy", "government", "public", "research", "social", "economics", "analysis", "impact", "governance", "reform"],
    subjectAffinity: ["Political Science", "Economics", "Social Studies", "History"],
    traits: ["analytical", "research-oriented", "communicator", "socially conscious"],
    skills: ["Policy Research", "Data Analysis", "Report Writing", "Stakeholder Engagement", "Economics"],
    stages: ["undergraduate", "jobshift"],
    degreeOptions: ["B.A Economics/Political Science", "M.A Public Policy", "MBA + Policy experience"],
    entryPaths: ["Think tanks", "Government fellowship programs", "NGOs", "Masters in Public Policy"],
    growthScore: 80,
    salaryBand: "₹5L – ₹25L+/yr",
    improvementAreas: ["Quantitative research methods", "International development", "Grant writing"],
    alternativeTitles: ["Economist", "Government Affairs Manager", "International Relations Specialist"]
  },

  // ─────────────────────────────────────────────────────────────────
  // RESEARCH & ACADEMIA
  // ─────────────────────────────────────────────────────────────────
  {
    id: "academic-researcher",
    title: "Research Scientist / Academic Professor",
    domain: "Research & Academia",
    sector: "Academia",
    summary: "Conducts original research, publishes findings, and teaches at university level.",
    keywords: ["research", "science", "academia", "professor", "phd", "lab", "study", "theory", "experiment", "knowledge"],
    subjectAffinity: ["Any science or humanities subject"],
    traits: ["deeply curious", "patient", "methodical", "knowledge-driven"],
    skills: ["Research Methodology", "Academic Writing", "Statistical Analysis", "Grant Writing", "Teaching"],
    stages: ["undergraduate", "jobshift"],
    degreeOptions: ["B.Sc/BA → M.Sc/MA → PhD → PostDoc"],
    entryPaths: ["University PhD programs", "CSIR/UGC fellowships", "GATE score for M.Tech research"],
    growthScore: 75,
    salaryBand: "₹5L – ₹30L+/yr (professor)",
    improvementAreas: ["Publication record", "Research grants", "Industry collaboration"],
    alternativeTitles: ["Postdoctoral Researcher", "Lecturer", "Scientist at ISRO/DRDO/CSIR"]
  },
  {
    id: "space-scientist",
    title: "Space Scientist / Aerospace Engineer",
    domain: "Research & Academia",
    sector: "Space & Aerospace",
    summary: "Designs spacecraft, analyzes space data, and drives research for space exploration.",
    keywords: ["space", "isro", "aerospace", "rocket", "satellite", "physics", "astronomy", "science", "nasa", "engineering"],
    subjectAffinity: ["Physics", "Mathematics", "Science & Math"],
    traits: ["deeply curious", "analytical", "detail-oriented", "visionary"],
    skills: ["Orbital Mechanics", "Propulsion Systems", "MATLAB/Python for simulations", "Systems Engineering"],
    stages: ["undergraduate", "jobshift"],
    streams: ["Science (PCM)"],
    degreeOptions: ["B.Tech Aerospace/Mechanical/Electronics", "M.Tech Aerospace", "ISRO recruitment (through GATE)"],
    entryPaths: ["GATE exam → ISRO/DRDO", "IIST admission", "Research internships at ISRO"],
    growthScore: 88,
    salaryBand: "₹6L – ₹30L+/yr",
    improvementAreas: ["Propulsion specialization", "Space data analysis", "Systems engineering"],
    alternativeTitles: ["Satellite Engineer", "Mission Analyst", "Rocket Scientist"]
  },

  // ─────────────────────────────────────────────────────────────────
  // EDUCATION
  // ─────────────────────────────────────────────────────────────────
  {
    id: "teacher-educator",
    title: "Teacher / School Educator",
    domain: "Education",
    sector: "School Education",
    summary: "Educates and inspires students from primary to senior secondary level.",
    keywords: ["teach", "education", "school", "student", "mentor", "guide", "explain", "learn", "classroom", "knowledge"],
    subjectAffinity: ["Any academic subject"],
    traits: ["patient", "communicator", "inspiring", "empathetic", "organised"],
    skills: ["Subject Mastery", "Classroom Management", "Curriculum Design", "Communication", "Assessment"],
    stages: ["undergraduate", "jobshift"],
    degreeOptions: ["B.Ed", "Any graduation + B.Ed", "D.El.Ed for primary"],
    entryPaths: ["B.Ed → government school recruitment (TET/CTET)", "Private school interviews"],
    growthScore: 78,
    salaryBand: "₹3L – ₹15L+/yr",
    improvementAreas: ["EdTech integration", "Curriculum design", "Inclusive teaching"],
    alternativeTitles: ["Subject Matter Expert", "EdTech Content Creator", "School Principal"]
  },
  {
    id: "edtech-product",
    title: "EdTech Product / Curriculum Designer",
    domain: "Education",
    sector: "EdTech",
    summary: "Builds educational products, courses, and learning experiences for digital platforms.",
    keywords: ["edtech", "education", "teaching", "learning", "online", "course", "curriculum", "content", "digital", "teach"],
    subjectAffinity: ["Education", "Computer Science", "Business"],
    traits: ["communicator", "creative", "structured", "educator"],
    skills: ["Instructional Design", "LMS Platforms", "Video Production", "Content Writing", "User Research"],
    stages: ["undergraduate", "jobshift"],
    degreeOptions: ["B.Ed + Tech skills", "B.Tech + Teaching interest", "Any + Instructional design certification"],
    entryPaths: ["EdTech startups (BYJU's/Vedantu/Unacademy)", "Online course creation", "School curriculum projects"],
    growthScore: 85,
    salaryBand: "₹5L – ₹25L+/yr",
    improvementAreas: ["Learning analytics", "Gamification", "Adaptive learning systems"],
    alternativeTitles: ["Online Educator", "Learning Experience Designer", "Academic Content Writer"]
  },

  // ─────────────────────────────────────────────────────────────────
  // MEDIA & COMMUNICATION
  // ─────────────────────────────────────────────────────────────────
  {
    id: "journalist",
    title: "Journalist / Reporter",
    domain: "Media & Communication",
    sector: "Journalism",
    summary: "Investigates, reports, and publishes news stories across print, digital, or broadcast media.",
    keywords: ["journalism", "writing", "news", "report", "media", "storytell", "communicate", "language", "current affairs"],
    subjectAffinity: ["Languages", "Social Studies", "History", "Political Science"],
    traits: ["inquisitive", "communicator", "brave", "ethical", "persistent"],
    skills: ["Reporting", "Interviewing", "Writing & Editing", "Research", "Digital Media Tools"],
    stages: ["undergraduate", "plus1plus2", "jobshift"],
    streams: ["Humanities/Arts"],
    degreeOptions: ["B.A Journalism", "B.A Mass Communication", "IIMC entrance"],
    entryPaths: ["Journalism school", "Internships at newspapers/TV channels", "Digital media startups"],
    growthScore: 77,
    salaryBand: "₹3L – ₹25L+/yr",
    improvementAreas: ["Data journalism", "Video reporting", "Investigative journalism"],
    alternativeTitles: ["Editor", "News Anchor", "Digital Content Writer"]
  },
  {
    id: "content-creator",
    title: "Content Creator / Influencer",
    domain: "Media & Communication",
    sector: "Digital Media",
    summary: "Builds audiences by creating engaging content on YouTube, Instagram, or podcasts.",
    keywords: ["content", "creator", "social media", "youtube", "instagram", "influencer", "creative", "video", "brand", "write"],
    subjectAffinity: ["Any"],
    traits: ["creative", "communicator", "self-motivated", "trend-aware", "entrepreneurial"],
    skills: ["Video Editing", "Copywriting", "SEO", "Personal Branding", "Analytics"],
    stages: ["class10", "plus1plus2", "undergraduate", "jobshift"],
    streams: ["Any"],
    degreeOptions: ["Any degree (or none)", "Digital marketing courses"],
    entryPaths: ["Start creating content", "Build niche audience", "Brand partnerships"],
    growthScore: 82,
    salaryBand: "₹0 – ₹Cr+/yr (highly variable)",
    improvementAreas: ["Monetization strategies", "Community building", "Analytics-driven growth"],
    alternativeTitles: ["Podcaster", "Blogger", "Brand Collaborator"]
  },
  {
    id: "pr-communications",
    title: "PR & Corporate Communications Manager",
    domain: "Media & Communication",
    sector: "Public Relations",
    summary: "Manages public image, press releases, and media relations for organisations.",
    keywords: ["communication", "pr", "public relations", "media", "brand", "writing", "corporate", "spokesperson", "message"],
    subjectAffinity: ["Languages", "Business", "Social Studies"],
    traits: ["communicator", "strategic", "persuasive", "organised"],
    skills: ["Media Relations", "Crisis Communication", "Press Release Writing", "Event Management", "Social Media"],
    stages: ["undergraduate", "jobshift"],
    degreeOptions: ["B.A Mass Communication", "MBA Marketing/Communication", "BBA + PR diploma"],
    entryPaths: ["PR agencies", "Corporate communication teams", "Internships"],
    growthScore: 80,
    salaryBand: "₹4L – ₹25L+/yr",
    improvementAreas: ["Digital PR", "Influencer management", "Reputation management tools"],
    alternativeTitles: ["Brand Communications Manager", "Media Spokesperson", "Corporate Affairs Lead"]
  },

  // ─────────────────────────────────────────────────────────────────
  // SOCIAL IMPACT
  // ─────────────────────────────────────────────────────────────────
  {
    id: "social-worker-ngo",
    title: "Social Worker / NGO Professional",
    domain: "Social Impact",
    sector: "Non-Profit & Development",
    summary: "Drives positive change in communities through social programs, advocacy, and field work.",
    keywords: ["social", "community", "ngo", "impact", "welfare", "help", "people", "development", "poverty", "change"],
    subjectAffinity: ["Social Studies", "Sociology", "Psychology", "Political Science"],
    traits: ["empathetic", "socially conscious", "communicator", "resilient", "mission-driven"],
    skills: ["Community Mobilization", "Program Management", "Report Writing", "Fundraising", "Field Research"],
    stages: ["undergraduate", "jobshift", "plus1plus2"],
    streams: ["Humanities/Arts"],
    degreeOptions: ["MSW (Master of Social Work)", "B.A Sociology/Social Work"],
    entryPaths: ["NGO internships", "Government social programs", "UN/UNDP fellowships"],
    growthScore: 74,
    salaryBand: "₹3L – ₹18L+/yr",
    improvementAreas: ["M&E (Monitoring & Evaluation)", "Grant writing", "International development exposure"],
    alternativeTitles: ["Development Sector Professional", "CSR Manager", "Impact Consultant"]
  },
  {
    id: "environmental-scientist",
    title: "Environmental Scientist / Climate Analyst",
    domain: "Social Impact",
    sector: "Environment & Sustainability",
    summary: "Studies environmental systems and develops solutions for climate and ecological challenges.",
    keywords: ["environment", "climate", "sustainability", "nature", "ecology", "green", "science", "conservation", "pollution"],
    subjectAffinity: ["Biology", "Chemistry", "Geography", "Science & Math"],
    traits: ["curious", "nature-lover", "research-oriented", "mission-driven"],
    skills: ["Environmental Data Analysis", "GIS Mapping", "Field Research", "Report Writing", "Policy Knowledge"],
    stages: ["undergraduate", "plus1plus2", "jobshift"],
    streams: ["Science (PCB)", "Science (PCM)"],
    degreeOptions: ["B.Sc Environmental Science", "B.Tech Environmental Engineering", "M.Sc Ecology"],
    entryPaths: ["CSIR/research labs", "Climate NGOs", "Government environment ministries", "UNEP"],
    growthScore: 82,
    salaryBand: "₹4L – ₹20L+/yr",
    improvementAreas: ["Climate finance", "ESG reporting", "Remote sensing tools"],
    alternativeTitles: ["Climate Change Analyst", "Sustainability Consultant", "Conservation Scientist"]
  }
];

/**
 * Returns all unique career domains in the dataset.
 */
export function getAllDomains(): CareerDomain[] {
  return [...new Set(CAREER_DATASET.map(c => c.domain))];
}

/**
 * Returns careers filtered by domain.
 */
export function getCareersByDomain(domain: CareerDomain): CareerEntry[] {
  return CAREER_DATASET.filter(c => c.domain === domain);
}

/**
 * Returns careers available for a given user stage.
 */
export function getCareersByStage(stage: string): CareerEntry[] {
  return CAREER_DATASET.filter(c => c.stages.includes(stage));
}
