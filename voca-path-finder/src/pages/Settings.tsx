// src/pages/Settings.tsx
import { useState } from "react";
import { VocaNavbar } from "@/components/voca/VocaNavbar";
import { VocaFooter } from "@/components/voca/VocaFooter";

interface ToggleProps {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}

function SettingToggle({ id, label, description, defaultChecked = false }: ToggleProps) {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <div className="text-sm font-medium font-body" style={{ color: "#edf1f7" }}>
          {label}
        </div>
        <div className="text-xs font-body mt-0.5" style={{ color: "#8b95a7" }}>
          {description}
        </div>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((v) => !v)}
        className="relative inline-flex items-center h-6 w-11 rounded-full border transition-all flex-shrink-0 mt-0.5"
        style={{
          backgroundColor: enabled ? "#0ea5a0" : "#1f2530",
          borderColor: enabled ? "#0ea5a0" : "rgba(255,255,255,0.10)",
        }}
      >
        <span
          className="inline-block w-4 h-4 rounded-full bg-white transition-transform"
          style={{ transform: enabled ? "translateX(24px)" : "translateX(4px)" }}
        />
      </button>
    </div>
  );
}

export default function Settings() {
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
              Preferences
            </p>
            <h1
              className="font-headline font-semibold"
              style={{ fontSize: "2rem", color: "#edf1f7" }}
            >
              Settings
            </h1>
          </div>

          {/* Notifications */}
          <div
            className="rounded-[16px] border p-8 md:p-10 mb-6"
            style={{ backgroundColor: "#11151b", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <h2
              className="font-headline font-semibold text-lg mb-6"
              style={{ color: "#edf1f7" }}
            >
              Notifications
            </h2>
            <div className="space-y-6">
              <SettingToggle
                id="notify-results"
                label="Result Updates"
                description="Notify me when new career insights are available"
                defaultChecked={true}
              />
              <SettingToggle
                id="notify-tips"
                label="Career Tips"
                description="Weekly skill and career path recommendations"
                defaultChecked={false}
              />
              <SettingToggle
                id="notify-product"
                label="Product Updates"
                description="News about VOCA features and improvements"
                defaultChecked={true}
              />
            </div>
          </div>

          {/* Privacy */}
          <div
            className="rounded-[16px] border p-8 md:p-10 mb-6"
            style={{ backgroundColor: "#11151b", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <h2
              className="font-headline font-semibold text-lg mb-6"
              style={{ color: "#edf1f7" }}
            >
              Privacy
            </h2>
            <div className="space-y-6">
              <SettingToggle
                id="privacy-analytics"
                label="Anonymous Analytics"
                description="Help us improve VOCA by sharing anonymized usage data"
                defaultChecked={true}
              />
              <SettingToggle
                id="privacy-recommendations"
                label="Personalized Recommendations"
                description="Use my profile to generate role-specific insights"
                defaultChecked={true}
              />
            </div>
          </div>

          {/* Appearance */}
          <div
            className="rounded-[16px] border p-8 md:p-10"
            style={{ backgroundColor: "#11151b", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <h2
              className="font-headline font-semibold text-lg mb-4"
              style={{ color: "#edf1f7" }}
            >
              Appearance
            </h2>
            <p className="text-sm font-body" style={{ color: "#8b95a7" }}>
              VOCA is a dark-first application. Light mode is not currently available.
            </p>
          </div>
        </main>
      </div>
      <VocaFooter variant="authenticated" />
    </div>
  );
}
