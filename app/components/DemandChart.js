"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DemandChart({ data, title }) {
  const chartData = {
    labels: data.map((d) => (d.hour !== undefined ? `${d.hour}:00` : d.date)),
    datasets: [
      {
        label: "Actual Demand",
        data: data.map((d) => d.actual),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        tension: 0.3,
        hidden: !data.some((d) => d.actual !== null),
      },
      {
        label: "Predicted Demand",
        data: data.map((d) => d.predicted),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgb(229, 231, 235)",
        },
      },
      title: {
        display: true,
        text: title,
        color: "rgb(229, 231, 235)",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(229, 231, 235, 0.1)",
        },
        ticks: {
          color: "rgb(229, 231, 235)",
        },
      },
      x: {
        grid: {
          color: "rgba(229, 231, 235, 0.1)",
        },
        ticks: {
          color: "rgb(229, 231, 235)",
        },
      },
    },
  };

  return <Line options={options} data={chartData} />;
}
