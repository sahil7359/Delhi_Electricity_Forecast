"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DemandChart from "../components/DemandChart";
import { historicalData } from "../data/mockData";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getDelhiInsights } from "../data/delhiDemandPatterns";
import {
  SunIcon,
  CloudIcon,
  SnowflakeIcon,
  SparklesIcon,
  FireIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Helper function for consistent date formatting
const formatDate = (date) => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};

export default function TrendsPage() {
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 7);

  const [dateRange, setDateRange] = useState([defaultStartDate, new Date()]);
  const [insights, setInsights] = useState([]);
  const [stats, setStats] = useState({
    avgDemand: 0,
    peakDemand: 0,
    weekendAvg: 0,
    weekdayAvg: 0,
  });

  // Update insights and stats when date range changes
  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      // Get Delhi-specific insights based on date range
      const delhiInsights = getDelhiInsights(dateRange[0], dateRange[1]);
      setInsights(delhiInsights);

      // Calculate statistics from filtered data
      const filtered = historicalData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= dateRange[0] && itemDate <= dateRange[1];
      });

      if (filtered.length > 0) {
        const weekdayData = filtered.filter((item) => !item.isWeekend);
        const weekendData = filtered.filter((item) => item.isWeekend);

        setStats({
          avgDemand: Math.round(
            filtered.reduce((acc, curr) => acc + curr.predicted, 0) /
              filtered.length
          ),
          peakDemand: Math.max(...filtered.map((item) => item.predicted)),
          weekendAvg: weekendData.length
            ? Math.round(
                weekendData.reduce((acc, curr) => acc + curr.predicted, 0) /
                  weekendData.length
              )
            : 0,
          weekdayAvg: weekdayData.length
            ? Math.round(
                weekdayData.reduce((acc, curr) => acc + curr.predicted, 0) /
                  weekdayData.length
              )
            : 0,
        });
      }
    }
  }, [dateRange]);

  // Filter data based on selected date range
  const filteredData = historicalData.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      dateRange[0] &&
      dateRange[1] &&
      itemDate >= dateRange[0] &&
      itemDate <= dateRange[1]
    );
  });

  const barChartData = {
    labels: filteredData.map((d) => formatDate(new Date(d.date))),
    datasets: [
      {
        label: "Peak Demand Forecast",
        data: filteredData.map((d) => d.peakDemandForecast),
        backgroundColor: "rgba(56, 189, 248, 0.8)",
      },
    ],
  };

  const barOptions = {
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
        text: "Peak Demand Forecast Periods",
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white/90">
          Demand Trends & Analysis
        </h1>

        {/* Filters */}
        <div className="card p-6 rounded-xl mb-8 bg-slate-800">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Date Range
              </label>
              <DatePicker
                selectsRange={true}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={(update) => setDateRange(update)}
                className="bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Average Demand</div>
                <div className="text-xl font-semibold">
                  {stats.avgDemand.toLocaleString()} MW
                </div>
              </div>
              <div className="bg-slate-700 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Peak Demand</div>
                <div className="text-xl font-semibold">
                  {stats.peakDemand.toLocaleString()} MW
                </div>
              </div>
              <div className="bg-slate-700 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Weekday Average</div>
                <div className="text-xl font-semibold">
                  {stats.weekdayAvg.toLocaleString()} MW
                </div>
              </div>
              <div className="bg-slate-700 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Weekend Average</div>
                <div className="text-xl font-semibold">
                  {stats.weekendAvg.toLocaleString()} MW
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card p-6 rounded-xl bg-slate-800">
            <DemandChart
              data={filteredData}
              title="Historical Demand Forecast Trends"
            />
          </div>
          <div className="card p-6 rounded-xl bg-slate-800">
            <Bar options={barOptions} data={barChartData} />
          </div>
        </div>

        {/* Insights */}
        <div className="card p-6 rounded-xl bg-slate-800">
          <h2 className="text-xl font-semibold mb-4">Key Insights for Delhi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg h-full transform transition-transform hover:scale-102 hover:shadow-lg ${
                  insight.type === "seasonal"
                    ? "bg-blue-900/50"
                    : insight.type === "festival"
                    ? "bg-purple-900/50"
                    : insight.type === "special"
                    ? "bg-red-900/50"
                    : "bg-slate-700"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {insight.type === "seasonal" &&
                      insight.title.toLowerCase().includes("summer") && (
                        <SunIcon className="h-6 w-6 text-yellow-400" />
                      )}
                    {insight.type === "seasonal" &&
                      insight.title.toLowerCase().includes("monsoon") && (
                        <CloudIcon className="h-6 w-6 text-blue-400" />
                      )}
                    {insight.type === "seasonal" &&
                      insight.title.toLowerCase().includes("winter") && (
                        <SnowflakeIcon className="h-6 w-6 text-cyan-400" />
                      )}
                    {insight.type === "seasonal" &&
                      insight.title.toLowerCase().includes("moderate") && (
                        <SparklesIcon className="h-6 w-6 text-green-400" />
                      )}
                    {insight.type === "festival" && (
                      <SparklesIcon className="h-6 w-6 text-purple-400" />
                    )}
                    {insight.type === "special" &&
                      insight.title.toLowerCase().includes("heatwave") && (
                        <FireIcon className="h-6 w-6 text-red-400" />
                      )}
                    {insight.type === "special" &&
                      insight.title.toLowerCase().includes("cold") && (
                        <SnowflakeIcon className="h-6 w-6 text-blue-400" />
                      )}
                    {insight.type === "general" && (
                      <ChartBarIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-400 mb-2">
                      {insight.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
