"use client";

import { useEffect, useState, useRef } from "react";

type RiskLevel = "normal" | "warning" | "critical";
export type AvatarSkin = "orb" | "robot" | "ghost";

interface AIAvatarProps {
  status?: RiskLevel;
  size?: "sm" | "md" | "lg";
  skin?: AvatarSkin;
}

export default function AIAvatar({ status = "normal", size = "md" }: AIAvatarProps) {
  const [floatY, setFloatY] = useState(0);
  const rafRef = useRef<number>(0);
  const t0Ref = useRef<number>(0);

  useEffect(() => {
    const loop = (ts: number) => {
      if (!t0Ref.current) t0Ref.current = ts;
      const elapsed = ts - t0Ref.current;
      setFloatY(Math.sin((elapsed / 1000) * (Math.PI * 2) / 2.6) * 3);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const px = { sm: 64, md: 88, lg: 120 }[size];
  const r = px / 2;

  const palette = {
    normal: {
      glow: "rgba(59,130,246,0.4)",
      bodyA: "#3b82f6",
      bodyB: "#1d4ed8",
      shadow: "rgba(59,130,246,0.3)",
      visor: "#1e293b",
      faceLine: "#93c5fd",
    },
    warning: {
      glow: "rgba(245,158,11,0.4)",
      bodyA: "#f59e0b",
      bodyB: "#b45309",
      shadow: "rgba(245,158,11,0.3)",
      visor: "#291e1d",
      faceLine: "#fde68a",
    },
    critical: {
      glow: "rgba(220,38,38,0.5)",
      bodyA: "#a84338",
      bodyB: "#6b2620",
      shadow: "rgba(220,38,38,0.35)",
      visor: "#1c1414",
      faceLine: "#fecaca",
    },
  }[status];

  const hatTotalH = px * 0.48;
  const brimW = px * 1.15;
  const brimH = px * 0.12;
  const domeW = px * 0.72;
  const domeH = px * 0.36;
  const badgeW = px * 0.14;
  const badgeH = px * 0.18;

  const visorW = px * 0.70;
  const visorH = px * 0.44;
  const visorCY = r * 0.15;

  const svgW = brimW;
  const svgH = hatTotalH;
  const svgOffX = (px - brimW) / 2;

  const uid = size + status;

  return (
    <div
      style={{
        width: px,
        position: "relative",
        height: px + px * 0.40,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: floatY,
          width: px,
          transition: "top 0.05s linear",
        }}
      >
        {/* ── HELM ── */}
        <svg
          width={svgW}
          height={svgH}
          style={{
            position: "absolute",
            left: svgOffX,
            top: 0,
            zIndex: 20,
            overflow: "visible",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
          }}
          viewBox={`0 0 ${svgW} ${svgH}`}
        >
          <defs>
            <linearGradient id={`hg-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>

          {/* Dome Helm */}
          <path
            d={`M ${(svgW - domeW) / 2} ${domeH + 2} 
               C ${(svgW - domeW) / 2} ${domeH * 0.2}, ${svgW - (svgW - domeW) / 2} ${domeH * 0.2}, ${svgW - (svgW - domeW) / 2} ${domeH + 2} 
               Z`}
            fill={`url(#hg-${uid})`}
            stroke="#e2e8f0"
            strokeWidth="0.5"
          />

          {/* Badge Depan Helm */}
          <rect
            x={(svgW - badgeW) / 2}
            y={domeH * 0.15}
            width={badgeW}
            height={badgeH}
            rx={badgeW * 0.3}
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="0.6"
          />

          {/* Lis Helm (Brim) */}
          <path
            d={`M 0 ${domeH} 
               Q ${svgW / 2} ${domeH - 2} ${svgW} ${domeH} 
               Q ${svgW / 2} ${domeH + brimH + 2} 0 ${domeH} Z`}
            fill={`url(#hg-${uid})`}
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
        </svg>

        {/* ── KEPALA ORB ── */}
        <div
          style={{
            position: "absolute",
            top: px * 0.30,
            left: 0,
            width: px,
            height: px,
            borderRadius: "50%",
            background: `radial-gradient(circle at 40% 35%, ${palette.bodyA}, ${palette.bodyB})`,
            boxShadow: `0 0 16px ${palette.glow}, inset 0 -4px 8px rgba(0,0,0,0.3)`,
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          {/* Surface Gloss */}
          <div
            style={{
              position: "absolute",
              top: "8%",
              left: "18%",
              width: "28%",
              height: "22%",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.22)",
              filter: "blur(2px)",
            }}
          />

          {/* Visor Area */}
          <svg
            width={px}
            height={px}
            viewBox={`${-r} ${-r} ${px} ${px}`}
            style={{ position: "absolute", inset: 0, zIndex: 5, overflow: "visible" }}
          >
            {/* Visor Ellipse */}
            <ellipse
              cx={0}
              cy={visorCY}
              rx={visorW / 2}
              ry={visorH / 2}
              fill={palette.visor}
            />

            {/* Mata Lengkung Kiri */}
            <path
              d={`M ${-px * 0.18} ${visorCY - px * 0.02} Q ${-px * 0.10} ${visorCY - px * 0.07} ${-px * 0.03} ${visorCY - px * 0.01}`}
              fill="none"
              stroke={palette.faceLine}
              strokeWidth={px * 0.035}
              strokeLinecap="round"
            />

            {/* Mata Lengkung Kanan */}
            <path
              d={`M ${px * 0.03} ${visorCY - px * 0.01} Q ${px * 0.10} ${visorCY - px * 0.07} ${px * 0.18} ${visorCY - px * 0.02}`}
              fill="none"
              stroke={palette.faceLine}
              strokeWidth={px * 0.035}
              strokeLinecap="round"
            />

            {/* Mulut Sedih Lengkung */}
            <path
              d={`M ${-px * 0.07} ${visorCY + px * 0.10} Q 0 ${visorCY + px * 0.04} ${px * 0.07} ${visorCY + px * 0.10}`}
              fill="none"
              stroke={palette.faceLine}
              strokeWidth={px * 0.035}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Shadow Bawah */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: px * 0.70,
          height: px * 0.08,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${palette.shadow} 0%, transparent 75%)`,
          opacity: 0.6 + (floatY / 3) * -0.15,
        }}
      />
    </div>
  );
}