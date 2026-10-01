"use client";

import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { Equipment } from "@/data/equipment";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface Props {
  equipment: Equipment[];
}

// Map equipment to matrix coordinates: x = impact (1-5), y = likelihood (1-5)
function toMatrix(eq: Equipment) {
  const impactMap: Record<number, number> = {
    87: 5, 65: 4, 58: 3, 42: 2,
  };
  const likelihoodMap: Record<string, number> = {
    High: 5, Medium: 3, Low: 1,
  };
  return {
    x: impactMap[eq.impactScore] ?? 3,
    y: likelihoodMap[eq.riskLevel] ?? 2,
    label: eq.id,
  };
}

const POINT_COLORS: Record<string, string> = {
  High: "rgba(239, 68, 68, 0.9)",
  Medium: "rgba(251, 191, 36, 0.9)",
  Low: "rgba(34, 197, 94, 0.9)",
};

export default function RiskMatrixChart({ equipment }: Props) {
  const datasets = equipment.map((eq) => {
    const pt = toMatrix(eq);
    return {
      label: eq.id,
      data: [{ x: pt.x, y: pt.y }],
      backgroundColor: POINT_COLORS[eq.riskLevel],
      pointRadius: 10,
      pointHoverRadius: 13,
    };
  });

  const chartData = { datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: { font: { size: 10 }, boxWidth: 10, padding: 8 },
      },
      tooltip: {
        callbacks: {
          label: (ctx: { dataset: { label: string }; parsed: { x: number; y: number } }) =>
            `${ctx.dataset.label} – Impact: ${ctx.parsed.x}, Likelihood: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 6,
        title: { display: true, text: "Impact", font: { size: 11 }, color: "#6b7280" },
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { stepSize: 1, font: { size: 10 }, color: "#9ca3af" },
      },
      y: {
        min: 0,
        max: 6,
        title: { display: true, text: "Likelihood", font: { size: 11 }, color: "#6b7280" },
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { stepSize: 1, font: { size: 10 }, color: "#9ca3af" },
      },
    },
  };

  return (
    <div className="relative w-full h-full">
      {/* Risk zone background */}
      <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
        <div className="w-full h-full grid grid-cols-5 grid-rows-5 opacity-20">
          {Array.from({ length: 25 }).map((_, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const score = (col + 1) * (5 - row);
            const bg =
              score >= 15
                ? "bg-red-200"
                : score >= 8
                ? "bg-yellow-100"
                : "bg-green-100";
            return <div key={i} className={bg} />;
          })}
        </div>
      </div>
      <Scatter data={chartData} options={options as Parameters<typeof Scatter>[0]["options"]} />
    </div>
  );
}
