import React from "react";

export const Star: React.FC<{ fill: number }> = ({ fill }) => {
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  const color = "#ffa726"; // orange
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" style={{ display: "inline-block" }}>
      <defs>
        <linearGradient id={`g-${pct}`} x1="0" y1="0" x2="100%" y2="0">
          <stop offset={`${pct}%`} stopColor={color} />
          <stop offset={`${pct}%`} stopColor="#e0e0e0" />
        </linearGradient>
      </defs>
      <path
        d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.21l8.2-1.192z"
        fill={`url(#g-${pct})`}
      />
    </svg>
  );
};

export const Stars: React.FC<{ value: number }> = ({ value }) => {
  // Convert 0..10 to 0..5 scale
  const s = Math.max(0, Math.min(10, value)) / 2;
  const stars = Array.from({ length: 5 }).map((_, i) => (
    <Star key={i} fill={Math.max(0, Math.min(1, s - i))} />
  ));
  return <div style={{ display: "flex", gap: 0 }}>{stars}</div>;
};

