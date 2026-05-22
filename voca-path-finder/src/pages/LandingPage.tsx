// src/pages/LandingPage.tsx
import { useNavigate, Link } from "react-router-dom";
import { VocaNavbar } from "@/components/voca/VocaNavbar";
import { VocaFooter } from "@/components/voca/VocaFooter";


export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen font-body"
      style={{ backgroundColor: "#0b0e12", color: "#e1e2e8" }}
    >
      {/* ── Top Navigation ─────────────────────────────────────── */}
      <VocaNavbar variant="public" />

      {/* ── Hero Section ───────────────────────────────────────── */}
      <section
        id="product"
        className="bg-mesh"
        style={{ paddingTop: "8rem", paddingBottom: "5rem" }}
      >
        <div
          className="max-w-voca px-6 md:px-12"
          style={{ maxWidth: "1440px", margin: "0 auto" }}
        >
          {/* Label */}
          <p
            className="font-body font-medium mb-6 tracking-widest uppercase"
            style={{ color: "#0ea5a0", fontSize: "0.8125rem", letterSpacing: "0.12em" }}
          >
            Career Intelligence Platform
          </p>

          {/* Heading */}
          <h1
            className="font-headline font-semibold leading-tight mb-6"
            style={{
              fontSize: "clamp(2.75rem, 1rem + 5.5vw, 6rem)",
              maxWidth: "56rem",
              color: "#e8e9ec",
              letterSpacing: "-0.02em",
            }}
          >
            Know where you're{" "}
            <span className="text-gradient-hero">headed.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="font-body mb-4"
            style={{
              fontSize: "clamp(1.125rem, 0.8rem + 1.3vw, 1.5rem)",
              maxWidth: "38rem",
              color: "#8b95a7",
              lineHeight: 1.65,
            }}
          >
            VOCA maps your skills, experience, and ambitions to the roles where
            you'll thrive — with clarity, not noise.
          </p>

          <p
            className="font-body mb-10"
            style={{ color: "#5a6070", fontSize: "0.9375rem" }}
          >
            Precision career guidance for builders, strategists & creators.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-20">
            <button
              onClick={() => navigate("/auth")}
              className="primary-cta font-body font-semibold rounded-full transition-all hover:opacity-90 active:scale-95"
              style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}
            >
              Get my career map →
            </button>
            <a
              href="#sample-results"
              className="font-body font-medium rounded-full transition-colors"
              style={{
                padding: "0.875rem 2rem",
                fontSize: "1rem",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "#8b95a7",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#e1e2e8")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#8b95a7")
              }
            >
              See sample results
            </a>
          </div>

          {/* Hero Preview Card */}
          <div
            className="hero-glow rounded-xl"
            style={{
              backgroundColor: "#1d2024",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "0.75rem",
              padding: "2rem",
              maxWidth: "36rem",
            }}
          >
            {/* Card header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <p
                  className="font-body mb-1"
                  style={{ color: "#5a6070", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}
                >
                  Recommended role
                </p>
                <h3
                  className="font-headline font-semibold"
                  style={{ color: "#e8e9ec", fontSize: "1.25rem" }}
                >
                  AI Product Manager
                </h3>
              </div>
              {/* Gold match pill */}
              <span className="tag-gold gold-score-glow" style={{ whiteSpace: "nowrap" }}>
                98% Match
              </span>
            </div>

            {/* Stats row */}
            <div
              className="grid grid-cols-2 gap-4 mb-5 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "1rem",
              }}
            >
              <div>
                <p
                  className="font-body mb-1"
                  style={{ color: "#5a6070", fontSize: "0.75rem" }}
                >
                  Market demand
                </p>
                <p
                  className="font-headline font-semibold"
                  style={{ color: "#0ea5a0", fontSize: "1.125rem" }}
                >
                  Very High ↑
                </p>
              </div>
              <div>
                <p
                  className="font-body mb-1"
                  style={{ color: "#5a6070", fontSize: "0.75rem" }}
                >
                  Skill gap
                </p>
                <p
                  className="font-headline font-semibold"
                  style={{ color: "#e8e9ec", fontSize: "1.125rem" }}
                >
                  2 areas
                </p>
              </div>
            </div>

            {/* Reasoning */}
            <p
              className="font-body"
              style={{
                color: "#7e8494",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                borderLeft: "2px solid rgba(14,165,160,0.35)",
                paddingLeft: "0.875rem",
              }}
            >
              Your combination of systems thinking, user research, and emerging AI
              literacy creates a strong foundation for AI-facing product roles. Two
              targeted skill gaps can be closed in under 6 months.
            </p>
          </div>
        </div>
      </section>

      {/* ── Problem Section ────────────────────────────────────── */}
      <section
        id="why"
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)", padding: "6rem 0" }}
      >
        <div
          className="max-w-voca px-6 md:px-12"
          style={{ maxWidth: "1440px", margin: "0 auto" }}
        >
          <p
            className="font-body mb-4"
            style={{
              color: "#0ea5a0",
              fontSize: "0.8125rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 500,
            }}
          >
            The problem
          </p>
          <h2
            className="font-headline font-semibold mb-14"
            style={{ fontSize: "clamp(1.75rem, 1rem + 2.5vw, 2.75rem)", color: "#e8e9ec", maxWidth: "32rem" }}
          >
            Most career tools leave you more confused, not less.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Too much noise",
                body: "Job boards flood you with thousands of titles. None feel like yours. You scroll, apply, repeat — without traction.",
              },
              {
                num: "02",
                title: "Advice without context",
                body: "Generic quizzes give generic results. They don't understand your lived experience, your constraints, or what you're actually building toward.",
              },
              {
                num: "03",
                title: "Unclear next steps",
                body: "Even when you know what you want, the gap between here and there feels unmapped. VOCA closes it — specifically for you.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="glass-card"
                style={{ padding: "2rem" }}
              >
                <span
                  className="font-headline font-bold block mb-5"
                  style={{ color: "#0ea5a0", fontSize: "0.75rem", letterSpacing: "0.15em" }}
                >
                  {item.num}
                </span>
                <h3
                  className="font-headline font-semibold mb-3"
                  style={{ color: "#e8e9ec", fontSize: "1.125rem" }}
                >
                  {item.title}
                </h3>
                <p
                  className="font-body"
                  style={{ color: "#7e8494", fontSize: "0.9375rem", lineHeight: 1.7 }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "6rem 0",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div
          className="max-w-voca px-6 md:px-12"
          style={{ maxWidth: "1440px", margin: "0 auto" }}
        >
          <p
            className="font-body mb-4"
            style={{
              color: "#0ea5a0",
              fontSize: "0.8125rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 500,
            }}
          >
            How it works
          </p>
          <h2
            className="font-headline font-semibold mb-14"
            style={{ fontSize: "clamp(1.75rem, 1rem + 2.5vw, 2.75rem)", color: "#e8e9ec" }}
          >
            Precision in three movements.
          </h2>

          {/* 12-col grid: step 01 takes 6 cols, steps 02+03 share 6 cols */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Step 01 — large */}
            <div
              className="glass-card md:col-span-6"
              style={{ padding: "2.5rem" }}
            >
              <span
                className="font-headline font-bold block mb-6"
                style={{ color: "#0ea5a0", fontSize: "0.75rem", letterSpacing: "0.15em" }}
              >
                01
              </span>
              <h3
                className="font-headline font-semibold mb-4"
                style={{ color: "#e8e9ec", fontSize: "1.5rem" }}
              >
                Tell VOCA your story
              </h3>
              <p
                className="font-body mb-6"
                style={{ color: "#7e8494", fontSize: "1rem", lineHeight: 1.7 }}
              >
                Through a guided conversation, VOCA learns your background, skills,
                values, and what excites you. Not a checkbox quiz — a real dialogue
                that surfaces what matters.
              </p>
              <div
                className="rounded-lg"
                style={{
                  background: "rgba(14,165,160,0.06)",
                  border: "1px solid rgba(14,165,160,0.12)",
                  padding: "1.25rem",
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#0ea5a0", fontSize: "1.25rem" }}>💬</span>
                <p className="font-body" style={{ color: "#8b95a7", fontSize: "0.875rem", lineHeight: 1.65 }}>
                  "What kind of problems do you most enjoy solving?" — VOCA asks
                  the questions that unlock clarity.
                </p>
              </div>
            </div>

            {/* Steps 02 + 03 stacked in 6 cols */}
            <div className="md:col-span-6 flex flex-col gap-6">
              {/* Step 02 */}
              <div
                className="glass-card flex-1"
                style={{ padding: "2rem" }}
              >
                <span
                  className="font-headline font-bold block mb-4"
                  style={{ color: "#0ea5a0", fontSize: "0.75rem", letterSpacing: "0.15em" }}
                >
                  02
                </span>
                <h3
                  className="font-headline font-semibold mb-3"
                  style={{ color: "#e8e9ec", fontSize: "1.25rem" }}
                >
                  Intelligence maps your fit
                </h3>
                <p
                  className="font-body"
                  style={{ color: "#7e8494", fontSize: "0.9375rem", lineHeight: 1.7 }}
                >
                  VOCA's model cross-references your profile against thousands of
                  real roles — weighting market demand, skill overlap, and growth
                  trajectory to surface your highest-signal paths.
                </p>
              </div>

              {/* Step 03 */}
              <div
                className="glass-card flex-1"
                style={{ padding: "2rem" }}
              >
                <span
                  className="font-headline font-bold block mb-4"
                  style={{ color: "#0ea5a0", fontSize: "0.75rem", letterSpacing: "0.15em" }}
                >
                  03
                </span>
                <h3
                  className="font-headline font-semibold mb-3"
                  style={{ color: "#e8e9ec", fontSize: "1.25rem" }}
                >
                  You get a clear career map
                </h3>
                <p
                  className="font-body"
                  style={{ color: "#7e8494", fontSize: "0.9375rem", lineHeight: 1.7 }}
                >
                  Ranked role matches with match scores, reasoning, skill gaps to
                  close, and concrete next steps — not a list of job titles, but a
                  real path forward.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sample Results ─────────────────────────────────────── */}
      <section
        id="sample-results"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "6rem 0" }}
      >
        <div
          className="max-w-voca px-6 md:px-12"
          style={{ maxWidth: "1440px", margin: "0 auto" }}
        >
          <div
            className="flex flex-col lg:flex-row gap-16 items-start"
          >
            {/* Left: headline + CTA */}
            <div style={{ flex: "1", maxWidth: "28rem" }}>
              <p
                className="font-body mb-4"
                style={{
                  color: "#0ea5a0",
                  fontSize: "0.8125rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 500,
                }}
              >
                Sample output
              </p>
              <h2
                className="font-headline font-semibold mb-6"
                style={{
                  fontSize: "clamp(1.75rem, 1rem + 2.5vw, 2.75rem)",
                  color: "#e8e9ec",
                  lineHeight: 1.2,
                }}
              >
                See how your fit becomes{" "}
                <span className="text-gradient-gold">clearer.</span>
              </h2>
              <p
                className="font-body mb-8"
                style={{ color: "#7e8494", fontSize: "1rem", lineHeight: 1.7 }}
              >
                Below is a real-style result card from VOCA. Every match comes
                with a score, your personal reasoning, skills to build, and what
                to do next.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="primary-cta font-body font-semibold rounded-full transition-all hover:opacity-90 active:scale-95"
                style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}
              >
                Get my results →
              </button>
            </div>

            {/* Right: result card */}
            <div style={{ flex: "1" }}>
              <div
                className="rounded-xl"
                style={{
                  backgroundColor: "#1d2024",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "2rem",
                  maxWidth: "28rem",
                }}
              >
                {/* Card header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p
                      className="font-body mb-1"
                      style={{ color: "#5a6070", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}
                    >
                      #1 Best match
                    </p>
                    <h3
                      className="font-headline font-semibold"
                      style={{ color: "#e8e9ec", fontSize: "1.25rem" }}
                    >
                      Technical Creative Director
                    </h3>
                  </div>
                  <span className="tag-gold gold-score-glow" style={{ whiteSpace: "nowrap" }}>
                    94% Match
                  </span>
                </div>

                {/* Skill bars */}
                <div className="space-y-3 mb-5">
                  {[
                    { label: "Creative strategy", pct: 91 },
                    { label: "Technical fluency", pct: 84 },
                    { label: "Team leadership", pct: 78 },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between mb-1">
                        <span
                          className="font-body"
                          style={{ color: "#8b95a7", fontSize: "0.8125rem" }}
                        >
                          {s.label}
                        </span>
                        <span
                          className="font-body font-medium"
                          style={{ color: "#0ea5a0", fontSize: "0.8125rem" }}
                        >
                          {s.pct}%
                        </span>
                      </div>
                      <div className="skill-bar-track">
                        <div
                          className="skill-bar-fill"
                          style={{
                            width: `${s.pct}%`,
                            background: "linear-gradient(90deg,#0ea5a0,#0d9390)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skill gaps */}
                <div
                  className="rounded-lg mb-5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    padding: "1rem",
                  }}
                >
                  <p
                    className="font-body mb-2"
                    style={{ color: "#5a6070", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}
                  >
                    Skills to develop
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["AI tooling", "Budget ownership"].map((skill) => (
                      <span
                        key={skill}
                        className="tag-red"
                        style={{ fontSize: "0.8125rem" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Next step */}
                <div
                  className="rounded-lg"
                  style={{
                    background: "rgba(14,165,160,0.06)",
                    border: "1px solid rgba(14,165,160,0.15)",
                    padding: "1rem",
                  }}
                >
                  <p
                    className="font-body mb-1"
                    style={{ color: "#0ea5a0", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}
                  >
                    Next step
                  </p>
                  <p
                    className="font-body"
                    style={{ color: "#8b95a7", fontSize: "0.875rem", lineHeight: 1.6 }}
                  >
                    Lead one cross-functional campaign that involves an engineering
                    partner — this builds both gaps simultaneously.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust / Privacy ────────────────────────────────────── */}
      <section
        id="privacy"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "6rem 0" }}
      >
        <div
          className="max-w-voca px-6 md:px-12"
          style={{ maxWidth: "1440px", margin: "0 auto" }}
        >
          <div className="text-center mb-14">
            <p
              className="font-body mb-3"
              style={{
                color: "#0ea5a0",
                fontSize: "0.8125rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 500,
              }}
            >
              Privacy
            </p>
            <h2
              className="font-headline font-semibold"
              style={{ fontSize: "clamp(1.75rem, 1rem + 2.5vw, 2.75rem)", color: "#e8e9ec" }}
            >
              Privacy-first by design.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔒",
                title: "Your data stays yours",
                body: "VOCA never sells or shares your profile. Your career story is private — always.",
              },
              {
                icon: "🧹",
                title: "Delete any time",
                body: "Request full deletion of your account and data at any moment, no questions asked.",
              },
              {
                icon: "🔍",
                title: "Transparent reasoning",
                body: "Every match score comes with plain-language reasoning so you always understand why.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass-card text-center"
                style={{ padding: "2rem" }}
              >
                <div
                  className="rounded-full mx-auto mb-5 flex items-center justify-center text-2xl"
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    background: "rgba(14,165,160,0.08)",
                    border: "1px solid rgba(14,165,160,0.15)",
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  className="font-headline font-semibold mb-3"
                  style={{ color: "#e8e9ec", fontSize: "1.0625rem" }}
                >
                  {item.title}
                </h3>
                <p
                  className="font-body"
                  style={{ color: "#7e8494", fontSize: "0.9375rem", lineHeight: 1.7 }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "5rem 0",
          background: "rgba(14,165,160,0.04)",
        }}
      >
        <div
          className="max-w-voca px-6 md:px-12 text-center"
          style={{ maxWidth: "1440px", margin: "0 auto" }}
        >
          <h2
            className="font-headline font-semibold mb-4"
            style={{ fontSize: "clamp(1.75rem, 1rem + 2.5vw, 3rem)", color: "#e8e9ec" }}
          >
            Ready to know where you're headed?
          </h2>
          <p
            className="font-body mb-8 mx-auto"
            style={{ color: "#7e8494", fontSize: "1.0625rem", maxWidth: "30rem" }}
          >
            Join thousands of professionals who've replaced career confusion with
            precision — powered by VOCA.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="primary-cta font-body font-semibold rounded-full transition-all hover:opacity-90 active:scale-95"
            style={{ padding: "1rem 2.5rem", fontSize: "1.0625rem" }}
          >
            Get my career map — it's free
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <VocaFooter variant="public" />

    </div>
  );
}
