interface LogoProps {
  size?: number;
}

const GREEN = "#0b7a4b";
const MARIGOLD = "#f4b41a";
const TERRACOTTA = "#d9572b";
const INK = "#231a12";
const CREAM = "#fbf5e9";

// Six awning stripes, alternating green and marigold
const STRIPES = [0, 1, 2, 3, 4, 5];

export default function Logo({ size = 44 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      {/* Badge */}
      <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill={CREAM} stroke={INK} strokeWidth="2" />

      {/* Awning stripes */}
      {STRIPES.map((i) => (
        <rect
          key={`s${i}`}
          x={6 + i * 6}
          y={9}
          width={6}
          height={9}
          fill={i % 2 === 0 ? GREEN : MARIGOLD}
        />
      ))}

      {/* Awning scallops, same colour as the stripe above each one */}
      {STRIPES.map((i) => (
        <circle
          key={`c${i}`}
          cx={9 + i * 6}
          cy={18}
          r={3}
          fill={i % 2 === 0 ? GREEN : MARIGOLD}
        />
      ))}

      {/* Posts */}
      <rect x="8" y="21" width="2" height="14" fill={INK} />
      <rect x="38" y="21" width="2" height="14" fill={INK} />

      {/* Produce on the counter */}
      <circle cx="16" cy="31" r="3.5" fill={MARIGOLD} stroke={INK} strokeWidth="1.2" />
      <circle cx="24" cy="30" r="4.5" fill={GREEN} stroke={INK} strokeWidth="1.2" />
      <circle cx="32" cy="31" r="3.5" fill={MARIGOLD} stroke={INK} strokeWidth="1.2" />

      {/* Counter */}
      <rect x="6" y="34" width="36" height="8" rx="2" fill={TERRACOTTA} stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}