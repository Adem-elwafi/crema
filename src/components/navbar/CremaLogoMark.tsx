import type { ReactNode } from 'react';

// Shared gradient defs factory — ensures unique IDs per render instance
// to prevent collisions when two NavLogo instances render simultaneously
// (split-clip dual-layer navbar)
function CremaDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E5B887" />
        <stop offset="50%" stopColor="#C68A4C" />
        <stop offset="100%" stopColor="#9E612B" />
      </linearGradient>
      <linearGradient id={`${id}-dark`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3D2314" />
        <stop offset="100%" stopColor="#231309" />
      </linearGradient>
      <linearGradient id={`${id}-steam`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#C68A4C" stopOpacity="0.9" />
        <stop offset="70%" stopColor="#E5B887" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FDF8F2" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${id}-crema`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#A0714D" />
        <stop offset="40%" stopColor="#E5B887" />
        <stop offset="100%" stopColor="#C68A4C" />
      </linearGradient>
    </defs>
  );
}

// ─────────────────────────────────────────────
// COMPACT MARK — used in the scrolled pill state
// ViewBox 80×80, rendered at w-8 h-8 (32px)
// C letterform + coffee cup, no steam, bold & crisp
// ─────────────────────────────────────────────
export function CompactMark({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <CremaDefs id={id} />

      {/* Bold C crescent — filled solid */}
      <path
        d="M 64 16
           C 50 6, 20 8, 10 28
           C 0 48, 10 70, 32 76
           C 44 79, 58 76, 66 66
           L 60 58
           C 50 64, 36 63, 26 55
           C 16 47, 16 33, 26 24
           C 36 15, 52 15, 60 22
           Z"
        fill={`url(#${id}-gold)`}
      />

      {/* Cup body — trapezoid, sits in the C bowl */}
      <path
        d="M 20 46 C 20 46, 23 62, 40 62 C 57 62, 62 46, 62 46 Z"
        fill={`url(#${id}-dark)`}
      />

      {/* Cup rim — crema ellipse surface */}
      <ellipse cx="41" cy="46" rx="21" ry="5.5"
        fill={`url(#${id}-dark)`}
      />
      <ellipse cx="41" cy="46" rx="18" ry="4"
        fill={`url(#${id}-crema)`}
      />

      {/* Cup handle — arc poking through C opening */}
      <path
        d="M 59 50 C 68 50, 72 56, 66 63 C 62 67, 57 65, 56 62"
        stroke={`url(#${id}-gold)`}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
// EXPANDED MARK — used in the hero / top-of-page state
// ViewBox 80×80, rendered at w-12 h-12 (48px)
// Same C+cup structure, adds steam paths for richness
// ─────────────────────────────────────────────
export function ExpandedMark({ id, isDark }: { id: string; isDark: boolean }) {
  // On cream background (dark variant), C is espresso brown
  // On brown background (light variant), C is gold gradient
  const cFill = isDark ? `url(#${id}-dark)` : `url(#${id}-gold)`;
  const cupFill = isDark ? '#C68A4C' : `url(#${id}-dark)`;
  const cremaFill = isDark ? '#3D2314' : `url(#${id}-crema)`;

  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <CremaDefs id={id} />

      {/* C crescent — slightly lighter stroke weight for expanded detail */}
      <path
        d="M 64 16
           C 50 6, 20 8, 10 28
           C 0 48, 10 70, 32 76
           C 44 79, 58 76, 66 66
           L 60 58
           C 50 64, 36 63, 26 55
           C 16 47, 16 33, 26 24
           C 36 15, 52 15, 60 22
           Z"
        fill={cFill}
      />

      {/* Cup body */}
      <path
        d="M 20 46 C 20 46, 23 62, 40 62 C 57 62, 62 46, 62 46 Z"
        fill={cupFill}
      />

      {/* Cup rim — layered crema surface with swirl highlight */}
      <ellipse cx="41" cy="46" rx="21" ry="5.5" fill={cupFill} />
      <ellipse cx="41" cy="46" rx="18" ry="4" fill={cremaFill} />
      {/* Crema swirl highlight — only visible in expanded state */}
      <path
        d="M 28 45 C 33 42, 46 42, 54 45 C 48 48, 33 47, 28 45 Z"
        fill={isDark ? '#E5B887' : '#E5B887'}
        opacity="0.7"
      />

      {/* Cup handle */}
      <path
        d="M 59 50 C 68 50, 72 56, 66 63 C 62 67, 57 65, 56 62"
        stroke={isDark ? '#9E612B' : `url(#${id}-gold)`}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Steam — primary wisp */}
      <path
        d="M 36 40 C 30 30, 42 22, 36 12 C 32 6, 40 2, 36 -4"
        stroke={`url(#${id}-steam)`}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Steam — secondary wisp, offset right */}
      <path
        d="M 44 38 C 40 30, 50 24, 44 15 C 40 9, 48 5, 44 -2"
        stroke={`url(#${id}-steam)`}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

// Re-export a combined wrapper for external use if needed
export function CremaLogoMark({
  variant,
  expanded,
  id,
}: {
  variant: 'light' | 'dark';
  expanded: boolean;
  id: string;
}): ReactNode {
  if (expanded) return <ExpandedMark id={id} isDark={variant === 'dark'} />;
  return <CompactMark id={id} />;
}
