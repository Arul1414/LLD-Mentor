import React from 'react';

interface ScoreGaugeProps {
  score: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, size = 'lg' }) => {
  const normalized = Math.min(100, Math.max(0, score));

  // Determine color theme based on score tier - aligned with LLD practice learning feedback
  let strokeColor = '#10B981'; // emerald
  let gradientId = 'score-emerald';
  let grade = 'A';
  let ratingLabel = 'Good Foundation';
  let badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (normalized >= 85) {
    strokeColor = '#10B981';
    gradientId = 'score-emerald';
    grade = 'A';
    ratingLabel = 'Good Foundation';
    badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (normalized >= 75) {
    strokeColor = '#0284C7'; // sky/cyan
    gradientId = 'score-cyan';
    grade = 'B+';
    ratingLabel = 'Solid Progress';
    badgeClasses = 'bg-sky-50 text-sky-700 border-sky-200';
  } else if (normalized >= 60) {
    strokeColor = '#D97706'; // amber
    gradientId = 'score-amber';
    grade = 'B';
    ratingLabel = 'Developing Design';
    badgeClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else {
    strokeColor = '#E11D48'; // rose
    gradientId = 'score-rose';
    grade = 'C';
    ratingLabel = 'Needs Iteration';
    badgeClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-1.5 font-mono">
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${badgeClasses}`}>
          {normalized}%
        </span>
      </div>
    );
  }

  // Radial SVG calculation
  const radius = 68;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="saas-card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden bg-white border border-slate-200 shadow-sm">
      <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-3">
        Design Evaluation Score
      </span>

      {/* Radial Progress Ring */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="score-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="score-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="score-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="score-rose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100"
            fill="transparent"
          />

          {/* Progress */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-baseline gap-0.5">
            <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-slate-900">
              {normalized}
            </span>
            <span className="text-sm font-mono text-slate-400">/100</span>
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-500 mt-0.5">EVALUATION</span>
        </div>
      </div>

      {/* Grade and rating badge */}
      <div className="flex items-center gap-2 mt-4">
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${badgeClasses}`}>
          Grade: {grade}
        </span>
        <span className="text-xs font-semibold text-slate-700">{ratingLabel}</span>
      </div>
    </div>
  );
};
