import React from "react";

const MAX_BAR_PX = 100;

export const BarRow: React.FC<{ label: string; percent?: number }> = ({ label, percent }) => {
  const p = typeof percent === "number" ? percent : 0;
  const widthPx = Math.round(Math.max(0, Math.min(100, p)) * (MAX_BAR_PX / 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
      <div
        style={{
          color: "#777",
          fontSize: 12,
          lineHeight: "14px",
          fontVariantNumeric: "tabular-nums",
          fontFeatureSettings: '"tnum" 1, "lnum" 1',
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ height: 10, width: `${widthPx}px`, background: "#ffcc80", borderRadius: 2 }} />
        <div style={{ color: "#777", fontSize: 12, lineHeight: "14px" }}>{p ? `${p.toFixed(1)}%` : ""}</div>
      </div>
    </div>
  );
};

