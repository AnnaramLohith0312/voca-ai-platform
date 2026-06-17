import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useVoca } from "@/contexts/VocaContext";
import { MatchScoreBadge } from "@/components/voca/MatchScoreBadge";
import { SkillBar } from "@/components/voca/SkillBar";
import { VocaNavbar } from "@/components/voca/VocaNavbar";
import { VocaFooter } from "@/components/voca/VocaFooter";
import { useAuth } from "@/contexts/AuthContext";
import { resultsService } from "@/services/resultsService";
import { askCareerFollowUp, type AgentMessage } from "@/engine/aiAgent";

// Helper for generating dynamic SWOT & Schedule
interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  schedule: { time: string; activity: string; description: string }[];
}

function getSwotAndSchedule(careerTitle: string, results: any): SWOTData {
  const title = careerTitle.toLowerCase();
  
  const strongest = results.primary?.strongestSignals || ["Analytical thinking", "Problem solving"];
  const improvements = results.primary?.improvementAreas || ["Technical specialization", "Advanced frameworks"];
  
  let strengths = [
    `Strong alignment with your core interest in ${strongest.slice(0, 2).join(" & ")}.`,
    "High capability in structured problem solving and critical analysis.",
    "Quick adaptation to new workflow paradigms and collaborative dynamics."
  ];
  
  let weaknesses = [
    `Requires bridging skills gap in: ${improvements.slice(0, 2).join(", ")}.`,
    "Steep initial learning curve for specialized enterprise toolchains.",
    "Requires building a robust portfolio of independent projects to show competency."
  ];
  
  let opportunities = [
    "High market demand in tier-1 tech cities (Bengaluru, Hyderabad, Pune, NCR).",
    "Rapidly growing sector with 20-25% CAGR in digital transformation roles.",
    "Strong pathways to move into senior cross-functional leadership or advisory positions."
  ];
  
  let threats = [
    "Automation of entry-level tasks by generative AI agents requires shifting to high-value reasoning.",
    "Highly competitive market requiring continuous micro-credentialing.",
    "Evolving framework standards that render older tech/design patterns obsolete in 2-3 years."
  ];

  let schedule = [
    { time: "09:30 AM", activity: "Sync & Prioritization", description: "Quick standup with the team to align on the day's blockers and milestones." },
    { time: "10:30 AM", activity: "Deep Focus Session", description: "Uninterrupted block for core engineering, styling, or strategy design." },
    { time: "01:30 PM", activity: "Cross-functional Review", description: "Collaboration session to demo work, gather feedback, and iterate." },
    { time: "03:30 PM", activity: "Refinement & Alignment", description: "Polishing details, documentation, or code reviews to maintain high quality." },
    { time: "05:00 PM", activity: "Wrap & Planning", description: "Analyzing metrics, logging progress, and sketching goals for tomorrow." }
  ];

  if (title.includes("manager") || title.includes("product") || title.includes("strategy") || title.includes("lead")) {
    strengths = [
      `Excellent alignment with your priority for ${results.primary?.priorities?.[0] || "Growth"} and leadership.`,
      `Strong communication foundation to bridge technical team and business needs.`,
      `Proven capability in organizing ideas and aligning cross-functional teams.`
    ];
    weaknesses = [
      `Need to develop deep technical domain expertise to gain trust of engineering units.`,
      `Managing conflicting stakeholder expectations and project scope creep.`,
      `Vulnerability to market adjustments in middle management positions.`
    ];
    opportunities = [
      "AI Product Management is one of the highest-growth roles in India, averaging ₹15-25L base salaries.",
      "Direct pathway to leadership tracks (Director, VP, or C-suite positions).",
      "Opportunity to shape product visions that impact millions of daily active users."
    ];
    threats = [
      "Stiff competition from top-tier MBA graduates and technical leads shifting to product.",
      "High burnout rates due to responsibility without direct authority.",
      "Rapidly changing technology landscape requires constant upskilling in AI/ML trends."
    ];
    schedule = [
      { time: "09:30 AM", activity: "Product Standup", description: "Standup with engineering and design to resolve blockers and track current sprint progress." },
      { time: "10:30 AM", activity: "Strategy & PRD Writing", description: "Deep focus on drafting product requirements documents and designing feature specs." },
      { time: "01:30 PM", activity: "Metrics & Data Analysis", description: "Reviewing funnel metrics, SQL queries, or user feedback on recent releases." },
      { time: "03:00 PM", activity: "Stakeholder Alignment", description: "Meeting with business, sales, and marketing teams to align on product roadmap." },
      { time: "05:00 PM", activity: "User Interview Sync", description: "Conducting user research calls to collect qualitative feedback for upcoming features." }
    ];
  } else if (title.includes("design") || title.includes("creative") || title.includes("ux") || title.includes("ui") || title.includes("art")) {
    strengths = [
      `Strong creative intuition aligned with your interests: ${strongest.slice(0, 2).join(" & ")}.`,
      "Empathy-driven approach to solving complex workflows and user layouts.",
      "Visual excellence and ability to translate abstract ideas into tangible designs."
    ];
    weaknesses = [
      `Requires mastering advanced design toolchains (Figma, Spline, Adobe Suite).`,
      "Potential difficulty in balancing creative vision with rigid technical constraints.",
      "Subjective nature of critique requires developing a resilient feedback mindset."
    ];
    opportunities = [
      "Booming demand for product design leads in Indian startups and product companies.",
      "Growing focus on premium design as a competitive differentiator globally.",
      "Pathway to transition into Product Management or Creative Direction roles."
    ];
    threats = [
      "AI-driven layout generation tools automate repetitive UI building, shifting demand to system-level thinking.",
      "Highly saturated market for junior UX/UI designers requiring a stellar portfolio.",
      "Tight deadlines in agency environments can challenge creative sustainability."
    ];
    schedule = [
      { time: "09:30 AM", activity: "Design Critique", description: "Reviewing draft wireframes with the design team to maintain system consistency." },
      { time: "10:30 AM", activity: "Figma Deep Focus", description: "Designing high-fidelity components, user flows, and interactive prototypes." },
      { time: "01:30 PM", activity: "UX Research / User Testing", description: "Observing users interact with prototypes and identifying usability friction." },
      { time: "03:30 PM", activity: "Dev Handoff & Sync", description: "Working with front-end engineers to inspect implemented UI elements and asset formats." },
      { time: "05:00 PM", activity: "Design System Maintenance", description: "Updating component variables, typography tokens, and documentation guides." }
    ];
  } else if (title.includes("developer") || title.includes("engineer") || title.includes("technical") || title.includes("software") || title.includes("architect")) {
    strengths = [
      `Robust technical logic, matching your strength in: ${strongest.slice(0, 2).join(" & ")}.`,
      "Strong analytical foundation and ability to architect clean, scalable solutions.",
      "Strong upskilling aptitude in modern web paradigms (Vite, Next.js, etc.)."
    ];
    weaknesses = [
      `Steep learning curves for advanced system design, scaling, and database optimizations.`,
      `Need to constantly update knowledge of rapidly shifting frameworks and tools.`,
      "Can get bogged down in technical debt rather than focusing on business value."
    ];
    opportunities = [
      "Unparalleled job density in tech hubs like Bengaluru, Pune, Hyderabad, and NCR.",
      "Global remote work options and freelancing contracts with premium compensation.",
      "Specializing in hot fields like AI engineering, cloud infra, or platform systems."
    ];
    threats = [
      "AI coding assistants (GitHub Copilot, Gemini) automating boilerplate coding, making system design skills critical.",
      "Saturating generalist market; specialization (e.g. distributed systems, devops, AI) is increasingly mandatory.",
      "Technological obsolescence of specific languages or legacy tech stacks."
    ];
    schedule = [
      { time: "09:30 AM", activity: "Daily Engineering Sync", description: "Standup to align on ticket statuses, API designs, and release cycles." },
      { time: "10:15 AM", activity: "Coding & Architecture", description: "Uninterrupted coding block: writing core components, business logic, or tests." },
      { time: "02:00 PM", activity: "Code Review & PRs", description: "Reviewing pull requests from peers and collaborating on structural issues." },
      { time: "03:30 PM", activity: "System Design Session", description: "Whiteboarding schema changes or microservices orchestration with the tech lead." },
      { time: "05:00 PM", activity: "Monitoring & Bug Triaging", description: "Checking Datadog/Sentry logs, resolving production exceptions, and planning tomorrow's branch." }
    ];
  } else if (title.includes("data") || title.includes("analyst") || title.includes("science") || title.includes("machine") || title.includes("ai")) {
    strengths = [
      `Data-driven intuition aligned with your interests in analytical domains.`,
      "Proficiency in extracting hidden patterns and presenting clear business insights.",
      "Strong mathematical or logical foundation to grasp complex statistical modeling."
    ];
    weaknesses = [
      `Requires mastering mathematical rigor (probability, linear algebra) alongside coding.`,
      "Data cleaning and preprocessing can consume 70%+ of project timelines, leading to fatigue.",
      "Difficulty in explaining complex probabilistic models to non-technical stakeholders."
    ];
    opportunities = [
      "Exponential growth in data-centric operations across e-commerce, fintech, and SaaS companies in India.",
      "Lucrative specialization tracks in Deep Learning, MLOps, and Decision Sciences.",
      "Direct business impact by driving revenue-optimizing recommendations or predictions."
    ];
    threats = [
      "Automated ML (AutoML) pipelines taking over basic model training tasks.",
      "Data privacy regulations (DPDP Act in India) restricting access to key training datasets.",
      "Model drift and code rot requiring constant maintenance overhead."
    ];
    schedule = [
      { time: "09:30 AM", activity: "Data Ops Standup", description: "Quick alignment on active pipelines, data quality, and model training tasks." },
      { time: "10:30 AM", activity: "Feature Engineering & Modeling", description: "Writing scripts (Jupyter/Python) to clean data and train models on server instances." },
      { time: "01:30 PM", activity: "SQL & Query Optimization", description: "Extracting bulk data sets from warehouses (Snowflake, BigQuery) for research." },
      { time: "03:00 PM", activity: "Analysis & Metrics Reporting", description: "Visualizing results in charts, drafting insights, and detailing accuracy scores." },
      { time: "05:00 PM", activity: "Pipelines Maintenance", description: "Deploying model updates, verifying latency profiles, and scheduling cron jobs." }
    ];
  }

  return { strengths, weaknesses, opportunities, threats, schedule };
}

export default function Results() {
  const navigate = useNavigate();
  const { results, loading, setResults, answersMap } = useVoca();
  const { user } = useAuth();

  // Swapping states
  const [isSwapping, setIsSwapping] = useState(false);

  // SWOT overlay state
  const [isSwotOpen, setIsSwotOpen] = useState(false);

  // AI Q&A States
  const [chatHistory, setChatHistory] = useState<AgentMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSwapPath = async (title: string) => {
    if (!user || isSwapping) return;
    setIsSwapping(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    try {
      const payload = await resultsService.generateResults(user.uid, answersMap, title);
      setResults(payload);
      setChatHistory([]); // Clear chat history to match the new primary path
    } catch (err) {
      console.error("Error swapping path:", err);
    } finally {
      setIsSwapping(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping || !results?.primary) return;

    const userText = chatInput.trim();
    setChatInput("");

    const userMessage: AgentMessage = { role: "user", parts: userText };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const reply = await askCareerFollowUp(
        results.primary.title,
        results.stage || "undergraduate",
        chatHistory,
        userText
      );
      setChatHistory((prev) => [...prev, { role: "model", parts: reply }]);
    } catch (err) {
      console.error("Error in career follow up:", err);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          parts: "I apologize, but I encountered an error. Please try asking again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Navigate to onboarding if no results are found after loading completes
  useEffect(() => {
    if (!loading && !results) {
      navigate("/onboarding");
    }
  }, [loading, results, navigate]);

  // Intersection observer for reveal animations
  useEffect(() => {
    if (loading || !results) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, results]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0b0e12" }}>
        <VocaNavbar variant="authenticated" />
        <div className="text-center mt-16">
          <div
            className="w-12 h-12 rounded-full border-2 border-t-transparent mx-auto mb-4"
            style={{ borderColor: "#0ea5a0", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }}
          />
          <p className="font-body text-sm" style={{ color: "#8b95a7" }}>
            Loading your results…
          </p>
        </div>
      </div>
    );
  }

  if (!results) return null;

  // ────────────────────────────────────────────────────────
  // RENDER: CLASS 10 STAGE
  // ────────────────────────────────────────────────────────
  if (results.stage === "class10") {
    return (
      <div className="min-h-screen" style={{ background: "#0b0e12" }}>
        <VocaNavbar variant="authenticated" />

        <main className="pt-24 pb-20 px-6 md:px-12 max-w-[1200px] mx-auto space-y-8">
          {/* Hero */}
          <section className="reveal hero-glow glass-card rounded-xl p-8 md:p-12 text-left">
            <p className="text-xs font-body font-semibold uppercase tracking-widest mb-3" style={{ color: "#0ea5a0" }}>
              Class 10 Exploration Profile
            </p>
            <h1 className="font-headline font-bold mb-4" style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "#e8e9ec", lineHeight: 1.15 }}>
              Your Career Stream Discovery
            </h1>
            <p className="font-body text-[15px] leading-relaxed mb-6" style={{ color: "#8b95a7" }}>
              At this stage, you're building a foundation. We've synthesized your interest in subjects and learning style to map out broad streams and career clusters that align with your natural strengths.
            </p>
            <div className="p-5 rounded-[12px] bg-[#11151b] border border-white/10">
              <h3 className="font-headline font-semibold text-[15px] mb-2" style={{ color: "#e8e9ec" }}>
                Why VOCA recommended this:
              </h3>
              <p className="font-body text-[14px] leading-relaxed" style={{ color: "#8b95a7" }}>
                {results.whyRecommended}
              </p>
            </div>
          </section>

          {/* Recommended Streams */}
          <section className="reveal space-y-6">
            <h2 className="font-headline font-semibold text-[22px]" style={{ color: "#e8e9ec" }}>
              Recommended Streams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.recommendedStreams.map((item, idx) => (
                <div key={idx} className="glass-card p-6 rounded-xl flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-headline font-semibold text-[16px]" style={{ color: "#e8e9ec" }}>
                        {item.stream}
                      </span>
                      <span className="tag-gold">{item.matchScore}% Fit</span>
                    </div>
                    <p className="font-body text-[14px] leading-relaxed" style={{ color: "#8b95a7" }}>
                      {item.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Career Clusters & Next steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="reveal glass-card p-8 space-y-6">
              <h2 className="font-headline font-semibold text-[20px]" style={{ color: "#e8e9ec" }}>
                Future Career Clusters
              </h2>
              <div className="space-y-4">
                {results.broadClusters.map((cluster, idx) => (
                  <div key={idx} className="p-5 rounded-lg bg-[#11151b]/60 border border-white/[0.06]">
                    <h3 className="font-headline font-semibold text-[15px] mb-2" style={{ color: "#e8e9ec" }}>
                      {cluster.name}
                    </h3>
                    <p className="font-body text-[13px] leading-relaxed" style={{ color: "#8b95a7" }}>
                      {cluster.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="reveal glass-card p-8 space-y-6">
              <h2 className="font-headline font-semibold text-[20px]" style={{ color: "#e8e9ec" }}>
                Early Skill Blueprint & Explorations
              </h2>
              <div>
                <h3 className="text-xs font-body uppercase tracking-wider mb-3" style={{ color: "#0ea5a0" }}>
                  Skills to build now
                </h3>
                <ul className="space-y-2 mb-6">
                  {results.skillsToBuild.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-[14px] font-body" style={{ color: "#8b95a7" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5a0]" />
                      {s}
                    </li>
                  ))}
                </ul>

                <h3 className="text-xs font-body uppercase tracking-wider mb-3" style={{ color: "#0ea5a0" }}>
                  Next Actions
                </h3>
                <ul className="space-y-2">
                  {results.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-center gap-2 text-[14px] font-body" style={{ color: "#8b95a7" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c99a43]" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Caution Alert */}
          <section className="reveal p-6 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.03]">
            <h3 className="font-headline font-semibold text-[16px] text-yellow-500 mb-2">
              Counselor Note
            </h3>
            <p className="font-body text-[14px] leading-relaxed" style={{ color: "#8b95a7" }}>
              {results.cautions}
            </p>
          </section>
        </main>

        <VocaFooter variant="authenticated" />
      </div>
    );
  }

  // ────────────────────────────────────────────────────────
  // RENDER: PLUS 1 / PLUS 2 STAGE
  // ────────────────────────────────────────────────────────
  if (results.stage === "plus1plus2") {
    return (
      <div className="min-h-screen" style={{ background: "#0b0e12" }}>
        <VocaNavbar variant="authenticated" />

        <main className="pt-24 pb-20 px-6 md:px-12 max-w-[1200px] mx-auto space-y-8">
          {/* Hero */}
          <section className="reveal hero-glow glass-card rounded-xl p-8 md:p-12 text-left">
            <p className="text-xs font-body font-semibold uppercase tracking-widest mb-3" style={{ color: "#0ea5a0" }}>
              Plus 1 / Plus 2 Academic Profile
            </p>
            <h1 className="font-headline font-bold mb-4" style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "#e8e9ec", lineHeight: 1.15 }}>
              Bridging School to Degree
            </h1>
            <p className="font-body text-[15px] leading-relaxed mb-6" style={{ color: "#8b95a7" }}>
              We've mapped your current stream specialization and core career interests to corresponding university courses and early professional domains.
            </p>
            <div className="p-5 rounded-[12px] bg-[#11151b] border border-white/10">
              <h3 className="font-headline font-semibold text-[15px] mb-2" style={{ color: "#e8e9ec" }}>
                VOCA Domain Analysis:
              </h3>
              <p className="font-body text-[14px] leading-relaxed" style={{ color: "#8b95a7" }}>
                {results.whyRecommended}
              </p>
            </div>
          </section>

          {/* Course and Domain mapping */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="reveal glass-card p-8 space-y-6">
              <h2 className="font-headline font-semibold text-[20px]" style={{ color: "#e8e9ec" }}>
                Recommended Degree Directions
              </h2>
              <div className="space-y-4">
                {results.degreeDirections.map((deg, idx) => (
                  <div key={idx} className="p-5 rounded-lg bg-[#11151b]/60 border border-white/[0.06]">
                    <h3 className="font-headline font-semibold text-[15px] mb-2" style={{ color: "#e8e9ec" }}>
                      {deg.degree}
                    </h3>
                    <p className="font-body text-[13px] leading-relaxed" style={{ color: "#8b95a7" }}>
                      {deg.why}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="reveal glass-card p-8 space-y-6">
              <h2 className="font-headline font-semibold text-[20px]" style={{ color: "#e8e9ec" }}>
                Matching Career Domains
              </h2>
              <div className="space-y-5">
                {results.matchingDomains.map((dom, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm font-body">
                      <span style={{ color: "#e8e9ec" }}>{dom.domain}</span>
                      <span style={{ color: "#0ea5a0" }}>{dom.matchScore}% Match</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${dom.matchScore}%`, background: "linear-gradient(90deg, #0ea5a0, #c99a43)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Action steps */}
          <section className="reveal glass-card p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xs font-body font-semibold uppercase tracking-wider mb-4" style={{ color: "#0ea5a0" }}>
                Academic Roadmap
              </h3>
              <ul className="space-y-3">
                {results.nextSteps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-[14px] font-body leading-relaxed" style={{ color: "#8b95a7" }}>
                    <span className="text-[#0ea5a0] font-bold">✓</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-body font-semibold uppercase tracking-wider mb-4" style={{ color: "#c99a43" }}>
                Skill Development
              </h3>
              <ul className="space-y-3">
                {results.skillBuildingSuggestions.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[14px] font-body leading-relaxed" style={{ color: "#8b95a7" }}>
                    <span className="text-[#c99a43] font-bold">★</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-body font-semibold uppercase tracking-wider mb-4" style={{ color: "#8b95a7" }}>
                Future Job Clusters
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.roleClusters.map((role, idx) => (
                  <span key={idx} className="tag-teal">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </main>

        <VocaFooter variant="authenticated" />
      </div>
    );
  }

  // ────────────────────────────────────────────────────────
  // RENDER: UNDERGRADUATE / JOBSHIFT STAGE
  // ────────────────────────────────────────────────────────
  const { primary } = results;
  const swotData = getSwotAndSchedule(primary.title, results);

  return (
    <div className="min-h-screen" style={{ background: "#0b0e12" }}>
      <VocaNavbar variant="authenticated" />

      <main className={`pt-24 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto path-swap-transition ${isSwapping ? "swapping" : ""}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── LEFT COLUMN ────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-8">
            {/* Stage indicator for adult flows */}
            <div className="flex justify-start">
              <span className="px-3 py-1 rounded-full text-xs font-body border border-white/10" style={{ background: "#11151b", color: "#8b95a7" }}>
                VOCA {results.stage === "undergraduate" ? "UG Career Readiness Map" : "Professional Transition Map"}
              </span>
            </div>

            {/* 1. Hero section */}
            <section className="reveal hero-glow glass-card rounded-xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                {/* Left */}
                <div className="flex-1">
                  <p className="text-xs font-body font-semibold uppercase tracking-widest mb-3" style={{ color: "#0ea5a0" }}>
                    {primary.category}
                  </p>
                  <h1 className="font-headline font-bold mb-6" style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "#e8e9ec", lineHeight: 1.15 }}>
                    {primary.title}
                  </h1>
                  <p className="font-body text-[15px] leading-relaxed mb-8" style={{ color: "#8b95a7" }}>
                    {primary.summary}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="primary-cta px-8 py-3 rounded-full font-body font-semibold text-[15px] transition-all hover:opacity-90 active:scale-95">
                      Explore Path
                    </button>
                    <button
                      onClick={() => setIsSwotOpen(true)}
                      className="px-8 py-3 rounded-full font-body font-semibold text-[15px] border transition-all hover:bg-white/5 cursor-pointer"
                      style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#e1e2e8" }}
                    >
                      Full Analysis
                    </button>
                  </div>
                </div>
                {/* Right: Match Score */}
                <div className="md:flex-shrink-0">
                  <MatchScoreBadge score={primary.matchScore} size="lg" />
                </div>
              </div>
            </section>

            {/* Stage-Specific Info Block (Job Shift: Transition Feasibility & Transferable Strengths) */}
            {results.stage === "jobshift" && results.transitionFeasibility && (
              <section className="reveal glass-card p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-body font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: "#c99a43" }}>
                    <span>⇄</span> Transition Feasibility ({results.transitionFeasibility.score}% Score)
                  </h3>
                  <p className="font-body text-[14px] leading-relaxed mb-1" style={{ color: "#e8e9ec" }}>
                    Difficulty Level: <strong className="text-white">{results.transitionFeasibility.difficulty}</strong>
                  </p>
                  <p className="font-body text-[13px] leading-relaxed" style={{ color: "#8b95a7" }}>
                    {results.transitionFeasibility.reason}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-body font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: "#0ea5a0" }}>
                    <span>★</span> Key Transferable Strengths
                  </h3>
                  {results.transferableStrengths && results.transferableStrengths.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {results.transferableStrengths.map((str, i) => (
                        <span key={i} className="tag-teal text-[12px]">
                          {str}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="font-body text-[13px] leading-relaxed" style={{ color: "#8b95a7" }}>
                      Analyses indicate strong operational maturity and leadership.
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Stage-Specific Info Block (Undergraduate: Specialization suggestions & placement) */}
            {results.stage === "undergraduate" && (
              <section className="reveal glass-card p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-body font-semibold uppercase tracking-wider mb-3" style={{ color: "#0ea5a0" }}>
                    Placement Readiness status
                  </h3>
                  <p className="font-body text-[14px] font-medium" style={{ color: "#e8e9ec" }}>
                    {results.placementReadiness}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-body font-semibold uppercase tracking-wider mb-3" style={{ color: "#0ea5a0" }}>
                    Recommended Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.specializationSuggestions.map((spec, i) => (
                      <span key={i} className="tag-gold text-[12px]">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 2. Strategic Rationale */}
            <section className="reveal">
              <h2 className="font-headline font-semibold text-[22px] mb-6" style={{ color: "#e8e9ec" }}>
                Strategic Rationale
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {primary.rationale.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-[12px] p-7"
                    style={{
                      background: "#11151b",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    <h3 className="font-headline font-semibold text-[17px] mb-3" style={{ color: "#e8e9ec" }}>
                      {item.heading}
                    </h3>
                    <p className="font-body text-[14px] leading-relaxed" style={{ color: "#8b95a7" }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Skill Blueprint Alignment */}
            <section className="glass-card reveal p-8">
              <h2 className="font-headline font-semibold text-[22px] mb-8" style={{ color: "#e8e9ec" }}>
                Skill Blueprint Alignment
              </h2>
              <div className="space-y-6 mb-10">
                {primary.skills.map((s, i) => (
                  <SkillBar key={i} skill={s.skill} level={s.level} percentage={s.percentage} variant={s.variant} />
                ))}
              </div>

              {/* Explainability block */}
              <div className="pt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="mb-8">
                  <h3 className="font-headline font-semibold text-[16px] mb-3" style={{ color: "#e8e9ec" }}>
                    Why VOCA recommended this
                  </h3>
                  <p className="font-body text-[14px] leading-relaxed" style={{ color: "#8b95a7" }}>
                    {primary.whyRecommended}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-headline font-semibold text-[14px] mb-3 uppercase tracking-wider" style={{ color: "#8b95a7" }}>
                    Your strongest signals
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {primary.strongestSignals.map((signal, i) => (
                      <span key={i} className="tag-teal">
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-headline font-semibold text-[14px] mb-3 uppercase tracking-wider" style={{ color: "#8b95a7" }}>
                    What to improve next
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {primary.improvementAreas.map((area, i) => (
                      <span key={i} className="tag-red">
                        {area}
                      </span>
                    ))}
                  </div>
                  <p className="font-body text-[13px]" style={{ color: "rgba(139,149,167,0.7)" }}>
                    {primary.improvementNote}
                  </p>
                </div>
              </div>
            </section>

            {/* AI Q&A Assistant Console */}
            <section className="reveal glass-card p-6 md:p-8 space-y-6">
              <div>
                <span className="tag-teal text-xs mb-2">VOCA Assistant</span>
                <h2 className="font-headline font-semibold text-[22px]" style={{ color: "#e8e9ec" }}>
                  Interactive Career Q&A
                </h2>
                <p className="font-body text-[14px] leading-relaxed" style={{ color: "#8b95a7" }}>
                  Have questions about salary tracks, core certificates, entry exams, or colleges in India for {primary.title}? Ask VOCA directly.
                </p>
              </div>

              <div className="chat-console">
                <div className="chat-console-messages chat-scroll">
                  {chatHistory.length === 0 ? (
                    <div className="m-auto text-center max-w-sm space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#0ea5a0]/15 flex items-center justify-center mx-auto text-[#0ea5a0] text-lg font-bold">
                        ?
                      </div>
                      <p className="font-headline font-semibold text-[14px]" style={{ color: "#e8e9ec" }}>
                        Ask anything about this role
                      </p>
                      <p className="font-body text-[12px]" style={{ color: "#8b95a7" }}>
                        e.g., "What is the average starting salary in Bengaluru?" or "Which certifications help most?"
                      </p>
                    </div>
                  ) : (
                    chatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={msg.role === "user" ? "user-bubble max-w-[80%]" : "voca-bubble max-w-[80%]"}
                          style={{
                            padding: "0.75rem 1.25rem",
                            fontSize: "14px",
                            lineHeight: "1.5"
                          }}
                        >
                          {msg.parts}
                        </div>
                      </div>
                    ))
                  )}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="voca-bubble max-w-[80%] py-3 px-4">
                        <div className="voca-typing-dots flex gap-1 items-center">
                          <span className="dot" />
                          <span className="dot" />
                          <span className="dot" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="chat-console-input-area">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask about ${primary.title}...`}
                    className="chat-console-input"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    className="chat-console-send-btn cursor-pointer"
                    disabled={isTyping || !chatInput.trim()}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </form>
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN ───────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Job Shift roadmap or UG Projects */}
            {results.stage === "jobshift" && results.upskillingRoadmap && (
              <div className="glass-card reveal p-6 space-y-5">
                <h3 className="font-headline font-semibold text-[17px]" style={{ color: "#e8e9ec" }}>
                  Upskilling roadmap
                </h3>
                <div className="space-y-4">
                  {results.upskillingRoadmap.map((item, idx) => (
                    <div key={idx} className="border-l-2 border-[#0ea5a0] pl-4 space-y-1">
                      <p className="font-headline font-semibold text-[14px]" style={{ color: "#e8e9ec" }}>
                        {item.step}
                      </p>
                      <p className="font-body text-[12px] leading-relaxed" style={{ color: "#8b95a7" }}>
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.stage === "undergraduate" && results.internshipProjects && (
              <div className="glass-card reveal p-6 space-y-5">
                <h3 className="font-headline font-semibold text-[17px]" style={{ color: "#e8e9ec" }}>
                  Recommended Projects
                </h3>
                <div className="space-y-3">
                  {results.internshipProjects.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-[#11151b] border border-white/5">
                      <p className="font-body text-[13px] leading-relaxed" style={{ color: "#8b95a7" }}>
                        {proj}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1. Priorities card */}
            <div
              className="reveal rounded-[12px] p-6"
              style={{
                background: "#11151b",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <h3 className="font-headline font-semibold text-[17px] mb-5" style={{ color: "#e8e9ec" }}>
                Your priorities
              </h3>
              <div className="flex flex-wrap gap-2 mb-5">
                {primary.priorities.map((p, i) => (
                  <span key={i} className="tag-teal">
                    {p}
                  </span>
                ))}
              </div>
              <p className="font-body text-[13px]" style={{ color: "rgba(139,149,167,0.7)" }}>
                {primary.prioritiesNote}
              </p>
            </div>

            {/* 2. Core Values card */}
            <div className="glass-card reveal p-8">
              <h3 className="font-headline font-semibold text-[17px] mb-6" style={{ color: "#e8e9ec" }}>
                Core Values Alignment
              </h3>
              <div className="space-y-5">
                {primary.coreValues.map((val, i) => (
                  <div key={i} className="flex gap-3">
                    <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="#0ea5a0" strokeWidth="1.5" fill="none" />
                      <path d="M8 12l3 3 5-5" stroke="#0ea5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <p className="font-body font-semibold text-[14px] mb-1" style={{ color: "#e1e2e8" }}>
                        {val.title}
                      </p>
                      <p className="font-body text-[13px] leading-relaxed" style={{ color: "#8b95a7" }}>
                        {val.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Alternative Paths */}
            <div className="reveal space-y-4">
              <h3 className="font-body font-semibold text-[12px] uppercase tracking-widest mb-4" style={{ color: "#8b95a7" }}>
                Alternative Paths
              </h3>
              {primary.alternativePaths.map((path, i) => (
                <div
                  key={i}
                  className="glass-card p-5 rounded-lg cursor-pointer transition-all hover:border-[#0ea5a0]/40"
                  style={{ transition: "background 0.15s, border-color 0.15s" }}
                  onClick={() => handleSwapPath(path.title)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-headline font-semibold text-[15px]" style={{ color: "#e8e9ec" }}>
                      {path.title}
                    </p>
                    <span className="tag-gold">{path.matchScore}%</span>
                  </div>
                  <p className="font-body text-[13px]" style={{ color: "#8b95a7" }}>
                    {path.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* SWOT Modal Overlay */}
      <div className={`swot-modal-overlay ${isSwotOpen ? "open" : ""}`} onClick={() => setIsSwotOpen(false)}>
        <div className="swot-modal-content max-w-4xl w-full p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div>
              <p className="text-xs font-body font-semibold uppercase tracking-widest text-[#0ea5a0]">
                {primary.category}
              </p>
              <h2 className="font-headline font-bold text-xl md:text-2xl text-[#e8e9ec]">
                {primary.title} — Deep Dive
              </h2>
            </div>
            <button 
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all cursor-pointer"
              onClick={() => setIsSwotOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-headline font-bold text-[18px] mb-4 text-[#e8e9ec]">
                SWOT Analysis
              </h3>
              <div className="swot-grid">
                {/* Strengths */}
                <div className="swot-quadrant swot-quadrant-s">
                  <h4 className="font-headline font-semibold text-[15px] text-[#0ea5a0] mb-3 flex items-center gap-1.5">
                    <span>●</span> Strengths (S)
                  </h4>
                  <ul className="space-y-2 text-[13px] font-body text-[#8b95a7] list-disc pl-4">
                    {swotData.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="swot-quadrant swot-quadrant-w">
                  <h4 className="font-headline font-semibold text-[15px] text-[#d96a6a] mb-3 flex items-center gap-1.5">
                    <span>●</span> Weaknesses (W)
                  </h4>
                  <ul className="space-y-2 text-[13px] font-body text-[#8b95a7] list-disc pl-4">
                    {swotData.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
                  </ul>
                </div>

                {/* Opportunities */}
                <div className="swot-quadrant swot-quadrant-o">
                  <h4 className="font-headline font-semibold text-[15px] text-[#c99a43] mb-3 flex items-center gap-1.5">
                    <span>●</span> Opportunities (O)
                  </h4>
                  <ul className="space-y-2 text-[13px] font-body text-[#8b95a7] list-disc pl-4">
                    {swotData.opportunities.map((o, idx) => <li key={idx}>{o}</li>)}
                  </ul>
                </div>

                {/* Threats */}
                <div className="swot-quadrant swot-quadrant-t">
                  <h4 className="font-headline font-semibold text-[15px] text-[#7c3aed] mb-3 flex items-center gap-1.5">
                    <span>●</span> Threats (T)
                  </h4>
                  <ul className="space-y-2 text-[13px] font-body text-[#8b95a7] list-disc pl-4">
                    {swotData.threats.map((t, idx) => <li key={idx}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <hr className="border-white/10" />

            {/* Day in the Life Timeline */}
            <div>
              <h3 className="font-headline font-bold text-[18px] mb-4 text-[#e8e9ec]">
                A Day in the Life
              </h3>
              <div className="space-y-4">
                {swotData.schedule.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-24 text-[12px] font-headline font-semibold text-[#0ea5a0] tracking-wider pt-0.5">
                      {item.time}
                    </div>
                    <div className="relative pb-4 pl-4 border-l border-white/10 flex-1">
                      <span className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0ea5a0]" />
                      <h4 className="font-headline font-semibold text-[14px] text-[#e8e9ec] mb-1">
                        {item.activity}
                      </h4>
                      <p className="font-body text-[13px] text-[#8b95a7] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <VocaFooter variant="authenticated" />
    </div>
  );
}
