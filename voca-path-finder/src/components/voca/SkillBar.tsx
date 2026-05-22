// src/components/voca/SkillBar.tsx
import { useEffect, useRef, useState } from "react";

interface SkillBarProps {
  skill: string;
  level: string;
  percentage: number;
  variant?: "teal" | "red";
}

const variantColors = {
  teal: { fill: "#0ea5a0", label: "#0ea5a0" },
  red: { fill: "#d96a6a", label: "#d96a6a" },
};

export function SkillBar({ skill, level, percentage, variant = "teal" }: SkillBarProps) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(percentage), 100);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [percentage]);

  const colors = variantColors[variant];

  return (
    <div className="space-y-2" ref={ref}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-[#e1e2e8] font-medium font-body">{skill}</span>
        <span className="font-body font-medium" style={{ color: colors.label }}>
          {level} ({percentage}%)
        </span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{ width: `${width}%`, backgroundColor: colors.fill }}
        />
      </div>
    </div>
  );
}
