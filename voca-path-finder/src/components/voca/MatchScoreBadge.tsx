// src/components/voca/MatchScoreBadge.tsx

interface MatchScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function MatchScoreBadge({ score, size = "md" }: MatchScoreBadgeProps) {
  // SVG circle math
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const dims = size === "sm" ? "w-16 h-16" : size === "lg" ? "w-32 h-32" : "w-24 h-24";
  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${dims} flex items-center justify-center gold-score-glow`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke="#323539"
            strokeWidth="4"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke="#c99a43"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <span
          className={`absolute font-headline font-bold ${textSize}`}
          style={{ color: "#c99a43" }}
        >
          {score}%
        </span>
      </div>
      <span
        className="text-[10px] mt-2 uppercase tracking-widest"
        style={{ color: "#8b95a7" }}
      >
        Match Score
      </span>
    </div>
  );
}
