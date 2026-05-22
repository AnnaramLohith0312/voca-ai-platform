// src/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import { VocaNavbar } from "@/components/voca/VocaNavbar";
import { VocaFooter } from "@/components/voca/VocaFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useVoca } from "@/contexts/VocaContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { results, onboardingComplete } = useVoca();

  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ backgroundColor: "#0b0e12" }}>
      <div>
        <VocaNavbar variant="authenticated" />

        <main className="pt-24 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto">
          {/* Greeting */}
          <section className="mb-16">
            <p
              className="text-[13px] font-body uppercase tracking-[0.2em] mb-3"
              style={{ color: "#8b95a7" }}
            >
              Welcome back
            </p>
            <h1
              className="font-headline font-semibold tracking-tight"
              style={{ fontSize: "clamp(2rem, 1.5rem + 2vw, 3rem)", color: "#edf1f7" }}
            >
              Hello, {firstName}
            </h1>
            <p className="font-body mt-2 max-w-xl" style={{ color: "#8b95a7" }}>
              Your career intelligence dashboard. Pick up where you left off.
            </p>
          </section>

          {/* Status cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Onboarding status */}
            <div
              className="p-6 rounded-[12px] border"
              style={{
                backgroundColor: "#11151b",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-[11px] font-body uppercase tracking-widest font-semibold"
                  style={{ color: onboardingComplete ? "#0ea5a0" : "#8b95a7" }}
                >
                  {onboardingComplete ? "Complete" : "Pending"}
                </span>
              </div>
              <h3
                className="font-headline font-semibold text-lg mb-2"
                style={{ color: "#edf1f7" }}
              >
                Career Assessment
              </h3>
              <p className="text-sm font-body mb-4" style={{ color: "#8b95a7" }}>
                {onboardingComplete
                  ? "Your profile has been built."
                  : "Answer a few questions to get your career map."}
              </p>
              <Link
                to={onboardingComplete ? "/results" : "/onboarding"}
                className="primary-cta inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-body transition-all hover:opacity-90 active:scale-95"
              >
                {onboardingComplete ? "View Results" : "Start Assessment"}
              </Link>
            </div>

            {/* Results status */}
            <div
              className="p-6 rounded-[12px] border"
              style={{
                backgroundColor: "#11151b",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-[11px] font-body uppercase tracking-widest font-semibold"
                  style={{ color: results ? "#c99a43" : "#8b95a7" }}
                >
                  {results ? "Ready" : "Not generated"}
                </span>
              </div>
              <h3
                className="font-headline font-semibold text-lg mb-2"
                style={{ color: "#edf1f7" }}
              >
                Career Map
              </h3>
              <p className="text-sm font-body mb-4" style={{ color: "#8b95a7" }}>
                {results
                  ? `Primary match: ${results.primary.title}`
                  : "Complete your assessment to generate your career map."}
              </p>
              {results && (
                <Link
                  to="/results"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-body border transition-all hover:bg-white/5"
                  style={{
                    borderColor: "rgba(255,255,255,0.10)",
                    color: "#e1e2e8",
                  }}
                >
                  View Full Results
                </Link>
              )}
            </div>

            {/* Account */}
            <div
              className="p-6 rounded-[12px] border"
              style={{
                backgroundColor: "#11151b",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-[11px] font-body uppercase tracking-widest font-semibold"
                  style={{ color: "#0ea5a0" }}
                >
                  Active
                </span>
              </div>
              <h3
                className="font-headline font-semibold text-lg mb-2"
                style={{ color: "#edf1f7" }}
              >
                Your Account
              </h3>
              <p className="text-sm font-body mb-4" style={{ color: "#8b95a7" }}>
                {user?.email}
              </p>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-body border transition-all hover:bg-white/5"
                style={{
                  borderColor: "rgba(255,255,255,0.10)",
                  color: "#e1e2e8",
                }}
              >
                Manage Profile
              </Link>
            </div>
          </div>

          {/* Quick nav */}
          <section>
            <h2
              className="font-headline font-semibold text-lg mb-6"
              style={{ color: "#edf1f7" }}
            >
              Quick navigation
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Results", href: "/results", desc: "View your career map" },
                { label: "Onboarding", href: "/onboarding", desc: "Retake assessment" },
                { label: "Profile", href: "/profile", desc: "Edit your details" },
                { label: "Settings", href: "/settings", desc: "App preferences" },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="p-5 rounded-[12px] border group hover:bg-white/[0.02] transition-colors"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.01)",
                    borderColor: "rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="font-headline font-semibold mb-1 group-hover:text-[#0ea5a0] transition-colors"
                    style={{ color: "#edf1f7" }}
                  >
                    {item.label}
                  </div>
                  <div className="text-sm font-body" style={{ color: "#8b95a7" }}>
                    {item.desc}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
      <VocaFooter variant="authenticated" />
    </div>
  );
}
