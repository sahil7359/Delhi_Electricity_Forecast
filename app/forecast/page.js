"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DemandChart from "../components/DemandChart";
import {
  generateHourlyData,
  generateAlerts,
  LAST_ACTUAL_DATE,
} from "../data/mockData";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Helper function for consistent date formatting
const formatDate = (date) => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};

// Helper function to generate peak demand alert
const generatePeakDemandAlert = (date) => {
  const isActualDataAvailable = new Date(date) <= new Date(LAST_ACTUAL_DATE);
  const peakHour = 14 + Math.floor(Math.random() * 3); // Peak between 2-4 PM

  return {
    peakTime: `${peakHour}:00`,
    highDemandPeriod: `${peakHour - 1}:00 - ${peakHour + 1}:00`,
    isActual: isActualDataAvailable,
  };
};

export default function ForecastPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(),
  ]);
  const [forecastData, setForecastData] = useState(
    generateHourlyData(new Date().toISOString().split("T")[0])
  );
  const [alerts, setAlerts] = useState(
    generateAlerts(new Date().toISOString().split("T")[0])
  );
  const [peakDemandInfo, setPeakDemandInfo] = useState(
    generatePeakDemandAlert(new Date())
  );

  const handleDateChange = (date) => {
    if (!date) return;
    setSelectedDate(date);
    const dateStr = date.toISOString().split("T")[0];
    setForecastData(generateHourlyData(dateStr));
    setAlerts(generateAlerts(dateStr));
    setPeakDemandInfo(generatePeakDemandAlert(date));
  };

  const handleDateRangeChange = (update) => {
    setDateRange(update);
    if (update[0] && update[1]) {
      // Generate data for the entire range
      const start = new Date(update[0]);
      const end = new Date(update[1]);
      const days = [];
      const currentDate = new Date(start);

      while (currentDate <= end) {
        const data = generateHourlyData(
          currentDate.toISOString().split("T")[0]
        );
        days.push({
          date: currentDate.toISOString().split("T")[0],
          actual:
            data.reduce(
              (acc, curr) => (curr.actual !== null ? acc + curr.actual : acc),
              0
            ) / 24,
          predicted: data.reduce((acc, curr) => acc + curr.predicted, 0) / 24,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setForecastData(days);
    }
  };

  const handleDownload = () => {
    const data = forecastData
      .map((d) => {
        const row = [d.hour !== undefined ? `${d.hour}:00` : d.date];
        if (d.actual !== null) row.push(d.actual);
        row.push(d.predicted);
        return row.join(",");
      })
      .join("\n");

    const headers = ["Time"];
    if (forecastData.some((d) => d.actual !== null)) headers.push("Actual");
    headers.push("Predicted");

    const csvContent = headers.join(",") + "\n" + data;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forecast-data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white/90">
          Demand Forecast
        </h1>

        {/* Peak Demand Alert */}
        <div className="mb-8 bg-gradient-to-br from-amber-950 to-brown-900 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-500 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-amber-500 mb-3">
                Peak Demand Alert
              </h2>
              <p className="text-gray-300 mb-2">
                Peak demand {peakDemandInfo.isActual ? "observed" : "expected"}{" "}
                at {peakDemandInfo.peakTime}
              </p>
              <p className="text-gray-300 mb-2">
                High demand period{" "}
                {peakDemandInfo.isActual ? "recorded" : "forecasted"} between{" "}
                {peakDemandInfo.highDemandPeriod}
              </p>
              <p className="text-gray-400 text-sm">
                Consider using heavy appliances during off-peak hours (11 PM - 5
                AM)
              </p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">
              Select Date for Forecast
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                dateFormat="yyyy-MM-dd"
              />
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download CSV
              </button>
            </div>
          </div>

          <div className="card p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Select Date Range</h2>
            <DatePicker
              selectsRange={true}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={handleDateRangeChange}
              className="bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        {/* Forecast Display */}
        <div className="card p-6 rounded-xl mb-8">
          <DemandChart
            data={forecastData}
            title={
              dateRange[0] && dateRange[1]
                ? "Average Daily Demand for Selected Range"
                : "Hourly Demand Forecast"
            }
          />
        </div>

        {/* Data Availability Notice */}
        <div className="text-sm text-gray-400 mb-8">
          Note: Actual data is only available up to {LAST_ACTUAL_DATE}. Dates
          after this will show predictions only.
        </div>
      </div>
    </main>
  );
}
