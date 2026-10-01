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
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

interface Props {
  vibrationValues: number[];
  alarmThreshold: number;
}

const labels = ["5d", "4d", "3d", "2d", "1d", "Now"];

export default function ParameterTrendChart({ vibrationValues, alarmThreshold }: Props) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Vibration (µm)",
        data: vibrationValues,
        fill: true,
        backgroundColor: "rgba(239, 68, 68, 0.07)",
        borderColor: "rgba(239, 68, 68, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(239, 68, 68, 1)",
        pointRadius: 3,
        tension: 0.35,
      },
      {
        label: "Alarm Threshold",
        data: Array(labels.length).fill(alarmThreshold),
        borderColor: "rgba(251, 191, 36, 0.9)",
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: { font: { size: 10 }, boxWidth: 12, padding: 8 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: "#9ca3af" },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          font: { size: 10 },
          color: "#9ca3af",
          callback: (v: string | number) => `${v}µm`,
        },
      },
    },
  };

  return <Line data={chartData} options={options as Parameters<typeof Line>[0]["options"]} />;
}
