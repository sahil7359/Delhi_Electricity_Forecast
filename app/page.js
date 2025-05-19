"use client";

import {
  historicalData,
  generateHourlyData,
  generateAlerts,
  LAST_ACTUAL_DATE,
} from "./data/mockData";
import DemandChart from "./components/DemandChart";

export default function Home() {
  // Get today's data
  const todayData = generateHourlyData(new Date().toISOString().split("T")[0]);
  const alerts = generateAlerts(new Date().toISOString().split("T")[0]);

  // Get last year's data
  const lastYearData = historicalData.filter((d) => {
    const date = new Date(d.date);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return date >= oneYearAgo;
  });

  // Calculate current stats
  const currentHour = new Date().getHours();
  const currentDemand = todayData[currentHour];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white/90">
          Delhi Power Grid Dashboard
        </h1>

        {/* Peak Demand Alert */}
        <div className="mb-8 bg-gradient-to-r from-amber-900/40 to-amber-800/40 rounded-xl p-6 border border-amber-700/50">
          <div className="flex items-start gap-4">
            <div className="text-amber-400 text-2xl">⚠️</div>
            <div>
              <h2 className="text-xl font-semibold text-amber-400 mb-2">
                Peak Demand Alert
              </h2>
              {alerts.map((alert) => (
                <p key={alert.id} className="text-gray-300 mb-2">
                  {alert.message}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900">
            <h3 className="text-sm text-gray-400 mb-1">Current Hour Demand</h3>
            <p className="text-3xl font-bold mb-2">
              {currentDemand.predicted.toLocaleString()} MW
            </p>
            {currentDemand.actual !== null && (
              <p className="text-sm text-gray-400">
                Actual: {currentDemand.actual.toLocaleString()} MW
              </p>
            )}
          </div>

          <div className="card p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900">
            <h3 className="text-sm text-gray-400 mb-1">
              Today's Peak Forecast
            </h3>
            <p className="text-3xl font-bold">
              {Math.max(...todayData.map((d) => d.predicted)).toLocaleString()}{" "}
              MW
            </p>
          </div>

          <div className="card p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900">
            <h3 className="text-sm text-gray-400 mb-1">Today's Low Forecast</h3>
            <p className="text-3xl font-bold">
              {Math.min(...todayData.map((d) => d.predicted)).toLocaleString()}{" "}
              MW
            </p>
          </div>
        </div>

        {/* Today's Chart */}
        <div className="card p-6 rounded-xl mb-8">
          <DemandChart data={todayData} title="Today's Electricity Demand" />
        </div>

        {/* Annual Trend */}
        <div className="card p-6 rounded-xl mb-8">
          <DemandChart data={lastYearData} title="Past Year's Demand Trend" />
        </div>

        {/* Data Availability Notice */}
        <div className="text-sm text-gray-400">
          Note: Actual data is only available up to {LAST_ACTUAL_DATE}. Dates
          after this will show predictions only.
        </div>
      </div>
    </main>
  );
}
