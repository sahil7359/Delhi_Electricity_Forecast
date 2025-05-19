// Mock data for Delhi electricity demand forecasting

// Constants
export const LAST_ACTUAL_DATE = "2024-12-10"; // Last date for which we have actual data

// Seasonal base demand patterns (in MW)
const SEASONAL_PATTERNS = {
  // Summer (April to July)
  summer: {
    baseLoad: 5000,
    variation: 2000,
    peakHours: [14, 15, 16], // 2 PM to 4 PM
  },
  // Monsoon (July to September)
  monsoon: {
    baseLoad: 4000,
    variation: 1500,
    peakHours: [13, 14, 15], // 1 PM to 3 PM
  },
  // Winter (November to February)
  winter: {
    baseLoad: 3000,
    variation: 1000,
    peakHours: [8, 9, 19, 20], // 8-9 AM and 7-8 PM
  },
  // Spring/Autumn (March, October)
  moderate: {
    baseLoad: 3500,
    variation: 1200,
    peakHours: [14, 15], // 2 PM to 3 PM
  },
};

// Festival demand multipliers
const FESTIVAL_MULTIPLIERS = {
  diwali: 1.2, // 20% increase
  navratri: 1.15, // 15% increase
  christmas: 1.1, // 10% increase
};

// Get season for a given date
const getSeason = (date) => {
  const month = date.getMonth() + 1;
  if ([4, 5, 6, 7].includes(month)) return "summer";
  if ([7, 8, 9].includes(month)) return "monsoon";
  if ([11, 12, 1, 2].includes(month)) return "winter";
  return "moderate";
};

// Check if date is during a festival period
const getFestivalMultiplier = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Diwali (approximate dates)
  if ((month === 10 && day >= 20) || (month === 11 && day <= 5))
    return FESTIVAL_MULTIPLIERS.diwali;

  // Navratri (approximate dates)
  if ((month === 9 && day >= 25) || (month === 10 && day <= 5))
    return FESTIVAL_MULTIPLIERS.navratri;

  // Christmas and New Year
  if (month === 12 && day >= 20) return FESTIVAL_MULTIPLIERS.christmas;

  return 1;
};

// Generate historical data with both actual and predicted values
const generateHistoricalData = () => {
  const data = [];
  const startDate = new Date("2022-12-10");
  const endDate = new Date("2026-12-31");
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const isActualDataAvailable = currentDate <= new Date(LAST_ACTUAL_DATE);
    const season = getSeason(currentDate);
    const seasonalPattern = SEASONAL_PATTERNS[season];
    const festivalMultiplier = getFestivalMultiplier(currentDate);

    // Base load with seasonal and festival factors
    const baseLoad = seasonalPattern.baseLoad * festivalMultiplier;

    // Add daily variation
    const hourOfDay = currentDate.getHours();
    const isPeakHour = seasonalPattern.peakHours.includes(hourOfDay);
    const timeVariation = isPeakHour
      ? seasonalPattern.variation
      : seasonalPattern.variation * 0.5;

    // Add weekly pattern (weekday vs weekend)
    const isWeekend = [0, 6].includes(currentDate.getDay());
    const weekendFactor = isWeekend ? 0.85 : 1; // 15% reduction on weekends

    // Calculate final values
    const finalBaseValue = baseLoad * weekendFactor;
    const randomVariation = (Math.random() - 0.5) * 200; // Small random variation

    const actualValue = isActualDataAvailable
      ? Math.round(finalBaseValue + timeVariation + randomVariation)
      : null;

    const predictedValue = Math.round(
      finalBaseValue + timeVariation + (Math.random() - 0.5) * 400
    );

    data.push({
      date: currentDate.toISOString().split("T")[0],
      actual: actualValue,
      predicted: predictedValue,
      peakDemand: isActualDataAvailable
        ? Math.round(finalBaseValue * 1.2 + Math.random() * 200)
        : null,
      peakDemandForecast: Math.round(
        finalBaseValue * 1.2 + Math.random() * 300
      ),
      lowestDemand: isActualDataAvailable
        ? Math.round(finalBaseValue * 0.7 + Math.random() * 200)
        : null,
      lowestDemandForecast: Math.round(
        finalBaseValue * 0.7 + Math.random() * 300
      ),
      season: season,
      isFestival: festivalMultiplier > 1,
      isWeekend: isWeekend,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

// Generate 24-hour data for a specific date
export const generateHourlyData = (targetDate) => {
  const isActualDataAvailable =
    new Date(targetDate) <= new Date(LAST_ACTUAL_DATE);
  const baseValue = 3000;
  return Array.from({ length: 24 }, (_, hour) => {
    const timeVariation = Math.sin(((hour - 12) * Math.PI) / 12) * 1000; // Daily pattern
    const actualValue = isActualDataAvailable
      ? Math.round(baseValue + timeVariation + (Math.random() - 0.5) * 200)
      : null;

    return {
      hour,
      actual: actualValue,
      predicted: Math.round(
        baseValue + timeVariation + (Math.random() - 0.5) * 400
      ),
    };
  });
};

export const historicalData = generateHistoricalData();

// Current day's data
export const todaysDemandData = generateHourlyData(
  new Date().toISOString().split("T")[0]
);

// Alert templates
export const generateAlerts = (date) => {
  const dateObj = new Date(date);
  const isActualDataAvailable = dateObj <= new Date(LAST_ACTUAL_DATE);
  const peakHour = 14 + Math.floor(Math.random() * 3); // Peak between 2-4 PM

  return [
    {
      id: 1,
      type: "warning",
      message: `Peak demand ${
        isActualDataAvailable ? "observed" : "expected"
      } at ${peakHour}:00`,
      severity: "high",
    },
    {
      id: 2,
      type: "info",
      message: `High demand period ${
        isActualDataAvailable ? "recorded" : "forecasted"
      } between ${peakHour - 1}:00 - ${peakHour + 1}:00`,
      severity: "medium",
    },
    {
      id: 3,
      type: "tip",
      message:
        "Consider using heavy appliances during off-peak hours (11 PM - 5 AM)",
      severity: "low",
    },
  ];
};

export const energySourceBreakdown = {
  Coal: 45,
  Solar: 20,
  Wind: 15,
  Hydro: 12,
  Nuclear: 5,
  Other: 3,
};

export const alerts = [
  {
    id: 1,
    type: "warning",
    message: "Peak demand expected today at 3:00 PM",
    severity: "high",
  },
  {
    id: 2,
    type: "info",
    message: "High demand period forecasted between 2 PM - 4 PM",
    severity: "medium",
  },
  {
    id: 3,
    type: "tip",
    message:
      "Consider using heavy appliances during off-peak hours (11 PM - 5 AM)",
    severity: "low",
  },
];
