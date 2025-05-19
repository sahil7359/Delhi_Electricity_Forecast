"use client";

import React from "react";

const DashboardCard = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
}) => {
  return (
    <div className="card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
        {Icon && <Icon className="h-6 w-6 text-blue-400" />}
      </div>
      <div className="flex items-baseline">
        <p className="text-3xl font-bold text-white">
          {value.toLocaleString()}
          <span className="text-gray-400 text-sm ml-1">{unit}</span>
        </p>
      </div>
      {trend && (
        <div
          className={`flex items-center mt-2 ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend === "up" ? "↑" : "↓"}
          <span className="text-sm ml-1">{trendValue}%</span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
