const RADIUS = 28;
const STROKE_WIDTH = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type ScoreDonutProps = {
  score: number;
  max?: number;
};

export function ScoreDonut({ score, max = 10 }: ScoreDonutProps) {
  const clamped = Math.min(Math.max(score, 0), max);
  const arc = (clamped / max) * CIRCUMFERENCE;

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        {/* Track */}
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          className="text-border"
        />
        {/* Arc */}
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${arc} ${CIRCUMFERENCE}`}
          strokeLinecap="round"
          className="text-accent-primary"
        />
      </svg>
      {/* Label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-accent-primary font-bold text-sm">
          {clamped}/{max}
        </span>
      </div>
    </div>
  );
}
