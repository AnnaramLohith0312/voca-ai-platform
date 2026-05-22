import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVoca } from "@/contexts/VocaContext";
import { MatchScoreBadge } from "@/components/voca/MatchScoreBadge";
import { SkillBar } from "@/components/voca/SkillBar";
import { VocaNavbar } from "@/components/voca/VocaNavbar";
import { VocaFooter } from "@/components/voca/VocaFooter";

export default function Results() {
  const navigate = useNavigate();
  const { results, loading } = useVoca();

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

  return (
    <div className="min-h-screen" style={{ background: "#0b0e12" }}>
      <VocaNavbar variant="authenticated" />

      <main className="pt-24 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto">
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
                      className="px-8 py-3 rounded-full font-body font-semibold text-[15px] border transition-all hover:bg-white/5"
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
                  className="glass-card p-5 rounded-lg cursor-pointer transition-all"
                  style={{ transition: "background 0.15s" }}
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

      <VocaFooter variant="authenticated" />
    </div>
  );
}
