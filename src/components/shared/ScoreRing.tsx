interface ScoreRingProps {
  score: number;
  size?: number;
}

export function ScoreRing({ score, size = 120 }: ScoreRingProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const color = score >= 75 ? "#00C896" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth="10" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={`${filled} ${circumference}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      />
      <text
        x={size / 2}
        y={size / 2 + 7}
        textAnchor="middle"
        fill={color}
        fontSize={size < 100 ? "16" : "22"}
        fontWeight="700"
        style={{ transform: "rotate(90deg)", transformOrigin: "center", fontFamily: "DM Sans, sans-serif" }}
      >
        {score}
      </text>
    </svg>
  );
}
