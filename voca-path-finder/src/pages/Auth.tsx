// src/pages/Auth.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { onboardingService } from "@/services/onboardingService";


type Mode = "signin" | "signup";

interface NetworkLine {
  id: number;
  top: string;
  delay: string;
  duration: string;
  opacity: number;
}

export default function Auth() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkLines, setNetworkLines] = useState<NetworkLine[]>([]);

  // Redirect if already logged in or newly logged in
  useEffect(() => {
    if (user) {
      onboardingService.getSession(user.uid).then((session) => {
        let targetPath = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "";
        if (!targetPath || targetPath === "/auth") {
          targetPath = session ? "/dashboard" : "/onboarding";
        }
        navigate(targetPath, { replace: true });
      });
    }
  }, [user, navigate, location.state]);


  // Generate animated network lines for the left panel
  useEffect(() => {
    const lines: NetworkLine[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      top: `${(i / 11) * 90 + 5}%`,
      delay: `${(i * 0.4).toFixed(1)}s`,
      duration: `${(2.5 + (i % 4) * 0.7).toFixed(1)}s`,
      opacity: 0.2 + (i % 3) * 0.15,
    }));
    setNetworkLines(lines);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      // Friendly error messages for common Firebase codes
      if (message.includes("wrong-password") || message.includes("invalid-credential")) {
        setError("Incorrect email or password. Please try again.");
      } else if (message.includes("user-not-found")) {
        setError("No account found with this email. Try signing up.");
      } else if (message.includes("email-already-in-use")) {
        setError("An account with this email already exists. Try signing in.");
      } else if (message.includes("weak-password")) {
        setError("Password must be at least 6 characters.");
      } else if (message.includes("invalid-email")) {
        setError("Please enter a valid email address.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex font-body"
      style={{ backgroundColor: "#0b0e12", color: "#e1e2e8" }}
    >
      {/* ── Left brand panel (desktop only) ─────────────────────── */}
      <div
        className="brand-gradient hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{ width: "44%", minHeight: "100vh", padding: "3rem" }}
      >
        {/* Animated network lines */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
        >
          {networkLines.map((line) => (
            <div
              key={line.id}
              className="network-line"
              style={{
                top: line.top,
                animationName: "flowLine",
                animationDuration: line.duration,
                animationDelay: line.delay,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                opacity: line.opacity,
              }}
            />
          ))}

          {/* Subtle radial glow */}
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "-20%",
              width: "60%",
              height: "60%",
              background: "radial-gradient(circle, rgba(14,165,160,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* VOCA logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link
            to="/"
            className="font-headline font-semibold"
            style={{ fontSize: "1.5rem", color: "#e8e9ec", textDecoration: "none" }}
          >
            VOCA
          </Link>
        </div>

        {/* Main brand copy */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "26rem" }}>
          <h1
            className="font-headline font-semibold mb-8"
            style={{
              fontSize: "clamp(1.75rem, 1rem + 2vw, 2.5rem)",
              color: "#e8e9ec",
              lineHeight: 1.25,
            }}
          >
            Career clarity, powered by{" "}
            <span className="text-gradient-hero">intelligent guidance.</span>
          </h1>

          <ul className="space-y-5">
            {[
              {
                icon: "✦",
                title: "Personalised match scores",
                desc: "Understand exactly how you fit each role — and why.",
              },
              {
                icon: "✦",
                title: "Skill gap analysis",
                desc: "Know what to build next to reach your target role faster.",
              },
              {
                icon: "✦",
                title: "Privacy-first",
                desc: "Your career story belongs to you. We never sell your data.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-3 items-start">
                <span
                  className="font-headline"
                  style={{ color: "#0ea5a0", fontSize: "1rem", marginTop: "0.15rem", flexShrink: 0 }}
                >
                  {item.icon}
                </span>
                <div>
                  <p
                    className="font-body font-semibold"
                    style={{ color: "#e8e9ec", fontSize: "0.9375rem", marginBottom: "0.25rem" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="font-body"
                    style={{ color: "#7e8494", fontSize: "0.875rem", lineHeight: 1.6 }}
                  >
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand footer */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            className="font-body"
            style={{ color: "#3a3f4a", fontSize: "0.8125rem" }}
          >
            © 2026 VOCA. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right auth panel ─────────────────────────────────────── */}
      <div
        className="flex-1 flex items-center justify-center"
        style={{ padding: "2rem", minHeight: "100vh" }}
      >
        <div
          className="auth-card rounded-2xl w-full"
          style={{ maxWidth: "28rem", padding: "2.5rem" }}
        >
          {/* Mobile VOCA logo */}
          <div className="lg:hidden mb-8">
            <Link
              to="/"
              className="font-headline font-semibold"
              style={{ fontSize: "1.25rem", color: "#e8e9ec", textDecoration: "none" }}
            >
              VOCA
            </Link>
          </div>

          {/* Heading */}
          <h2
            className="font-headline font-semibold mb-2"
            style={{ color: "#e8e9ec", fontSize: "1.5rem" }}
          >
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p
            className="font-body mb-8"
            style={{ color: "#7e8494", fontSize: "0.9375rem" }}
          >
            {mode === "signin"
              ? "Sign in to access your career map."
              : "Start your free VOCA account today."}
          </p>

          {/* Tab switcher */}
          <div
            className="flex mb-6 rounded-full p-1"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className="flex-1 font-body font-medium rounded-full transition-all"
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.9375rem",
                  ...(mode === m
                    ? { background: "#0ea5a0", color: "#ffffff" }
                    : { background: "transparent", color: "#7e8494" }),
                }}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Error box */}
          {error && (
            <div
              className="rounded-lg mb-5"
              style={{
                background: "rgba(217,106,106,0.10)",
                border: "1px solid rgba(217,106,106,0.25)",
                padding: "0.875rem 1rem",
              }}
            >
              <p
                className="font-body"
                style={{ color: "#d96a6a", fontSize: "0.875rem", lineHeight: 1.5 }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Name field — sign up only, animated */}
            <div
              style={{
                overflow: "hidden",
                maxHeight: mode === "signup" ? "6rem" : "0",
                transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                marginBottom: mode === "signup" ? "1rem" : "0",
              }}
            >
              <label
                htmlFor="auth-name"
                className="font-body block mb-1.5"
                style={{ color: "#8b95a7", fontSize: "0.875rem" }}
              >
                Full name
              </label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="input-field"
                required={mode === "signup"}
                tabIndex={mode === "signup" ? 0 : -1}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="auth-email"
                className="font-body block mb-1.5"
                style={{ color: "#8b95a7", fontSize: "0.875rem" }}
              >
                Email address
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: mode === "signin" ? "0.5rem" : "1.5rem" }}>
              <label
                htmlFor="auth-password"
                className="font-body block mb-1.5"
                style={{ color: "#8b95a7", fontSize: "0.875rem" }}
              >
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                className="input-field"
                required
              />
            </div>

            {/* Forgot password — sign in only */}
            {mode === "signin" && (
              <div className="text-right mb-5">
                <button
                  type="button"
                  className="font-body transition-colors"
                  style={{ color: "#0ea5a0", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => {
                    // Placeholder — wire to sendPasswordReset(email) if needed
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="primary-cta font-body font-semibold rounded-full w-full transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
              style={{
                padding: "0.875rem 1.5rem",
                fontSize: "1rem",
                opacity: loading ? 0.75 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading && (
                <svg
                  aria-hidden="true"
                  className="animate-spin"
                  style={{ width: "1.125rem", height: "1.125rem" }}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity="0.3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {loading
                ? mode === "signin"
                  ? "Signing in…"
                  : "Creating account…"
                : mode === "signin"
                ? "Sign in"
                : "Create account"}
            </button>
          </form>

          {/* OR divider */}
          <div className="flex items-center gap-3 my-6">
            <div
              style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }}
            />
            <span
              className="font-body"
              style={{ color: "#3a3f4a", fontSize: "0.8125rem" }}
            >
              or continue with
            </span>
            <div
              style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }}
            />
          </div>

          {/* Social buttons */}
          <div className="flex gap-3 mb-4">
            {/* Google */}
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 font-body font-medium rounded-full transition-all"
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "#8b95a7",
                fontSize: "0.9375rem",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
                (e.currentTarget as HTMLButtonElement).style.color = "#e1e2e8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.09)";
                (e.currentTarget as HTMLButtonElement).style.color = "#8b95a7";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            {/* LinkedIn */}
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 font-body font-medium rounded-full transition-all"
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "#8b95a7",
                fontSize: "0.9375rem",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
                (e.currentTarget as HTMLButtonElement).style.color = "#e1e2e8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.09)";
                (e.currentTarget as HTMLButtonElement).style.color = "#8b95a7";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </button>
          </div>

          {/* Magic link */}
          <div className="text-center mb-6">
            <button
              type="button"
              className="font-body transition-colors"
              style={{ color: "#0ea5a0", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer" }}
            >
              Continue with magic link →
            </button>
          </div>

          {/* Privacy note */}
          <p
            className="font-body text-center mb-6"
            style={{ color: "#3a3f4a", fontSize: "0.8125rem", lineHeight: 1.6 }}
          >
            By continuing, you agree to VOCA's{" "}
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              style={{ color: "#5a6070", textDecoration: "underline", textDecorationStyle: "dotted" }}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              style={{ color: "#5a6070", textDecoration: "underline", textDecorationStyle: "dotted" }}
            >
              Privacy Policy
            </a>
            .
          </p>

          {/* Footer links */}
          <div
            className="flex justify-center gap-5 pt-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {[
              { label: "Privacy", href: "#privacy" },
              { label: "Terms", href: "#terms" },
              { label: "© 2026 VOCA", href: "/" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("#")) e.preventDefault();
                }}
                className="font-body transition-colors"
                style={{ color: "#3a3f4a", fontSize: "0.75rem" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#7e8494")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#3a3f4a")
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
