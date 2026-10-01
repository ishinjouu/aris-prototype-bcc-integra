"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { statusBarChartData as StatusBarData } from "@/data/equipment";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  data: typeof StatusBarData;
}

export default function StatusBarChart({ data }: Props) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Normal",
        data: data.normal,
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderRadius: 2,
      },
      {
        label: "Warning",
        data: data.warning,
        backgroundColor: "rgba(251, 191, 36, 0.8)",
        borderRadius: 2,
      },
      {
        label: "Emerging Risk",
        data: data.emerging,
        backgroundColor: "rgba(249, 115, 22, 0.8)",
        borderRadius: 2,
      },
      {
        label: "Maintenance",
        data: data.maintenance,
        backgroundColor: "rgba(96, 165, 250, 0.8)",
        borderRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { font: { size: 9 }, color: "#9ca3af" },
      },
      y: {
        stacked: true,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { font: { size: 9 }, color: "#9ca3af", stepSize: 2 },
      },
    },
  };

  return <Bar data={chartData} options={options as Parameters<typeof Bar>[0]["options"]} />;
}
