// src/pages/Profile.tsx
import { useState } from "react";
import { VocaNavbar } from "@/components/voca/VocaNavbar";
import { VocaFooter } from "@/components/voca/VocaFooter";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ backgroundColor: "#0b0e12" }}>
      <div>
        <VocaNavbar variant="authenticated" />

        <main className="pt-24 pb-20 px-6 md:px-12 max-w-[900px] mx-auto">
          <div className="mb-12">
            <p
              className="text-[13px] font-body uppercase tracking-[0.2em] mb-2"
              style={{ color: "#8b95a7" }}
            >
              Account
            </p>
            <h1
              className="font-headline font-semibold"
              style={{ fontSize: "2rem", color: "#edf1f7" }}
            >
              Your Profile
            </h1>
          </div>

          <div
            className="rounded-[16px] border p-8 md:p-10"
            style={{
              backgroundColor: "#11151b",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium font-body mb-2 ml-1"
                  style={{ color: "#8b95a7" }}
                  htmlFor="profile-name"
                >
                  Full Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  className="input-field"
                  defaultValue={user?.displayName ?? ""}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium font-body mb-2 ml-1"
                  style={{ color: "#8b95a7" }}
                  htmlFor="profile-email"
                >
                  Email Address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  className="input-field"
                  defaultValue={user?.email ?? ""}
                  placeholder="your@email.com"
                  disabled
                  style={{ opacity: 0.5, cursor: "not-allowed" }}
                />
                <p className="text-xs mt-1 ml-1" style={{ color: "#576073" }}>
                  Email cannot be changed.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="primary-cta px-8 py-3 rounded-full font-body font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                >
                  {saved ? "Saved ✓" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          <div
            className="mt-8 rounded-[16px] border p-8"
            style={{
              backgroundColor: "#11151b",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <h2
              className="font-headline font-semibold text-lg mb-2"
              style={{ color: "#edf1f7" }}
            >
              Data & Privacy
            </h2>
            <p className="text-sm font-body mb-6" style={{ color: "#8b95a7" }}>
              Your data is private and used only to generate your career recommendations. We do not share or sell your information.
            </p>
            <button
              className="text-sm font-body font-medium border rounded-full px-5 py-2.5 transition-all hover:bg-white/5"
              style={{ borderColor: "rgba(217,106,106,0.30)", color: "#d96a6a" }}
            >
              Delete My Data
            </button>
          </div>
        </main>
      </div>
      <VocaFooter variant="authenticated" />
    </div>
  );
}
