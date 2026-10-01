"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import type { ProductionTrendPoint } from "@/data/equipment";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface Props {
  data: ProductionTrendPoint[];
}

export default function ProductionTrendChart({ data }: Props) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Production %",
        data: data.map((d) => d.value),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        borderColor: "rgba(59, 130, 246, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { y: number } }) => ` ${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: "#9ca3af" },
      },
      y: {
        min: 80,
        max: 100,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          font: { size: 10 },
          color: "#9ca3af",
          callback: (v: string | number) => `${v}%`,
        },
      },
    },
  };

  return <Line data={chartData} options={options as Parameters<typeof Line>[0]["options"]} />;
}
