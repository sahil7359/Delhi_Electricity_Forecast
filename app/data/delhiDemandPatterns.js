// Delhi-specific electricity demand patterns and insights

// Base demand patterns by season (in MW)
export const DELHI_SEASONAL_PATTERNS = {
  summer: {
    months: [4, 5, 6], // April to June
    baseLoad: 4500,
    peakLoad: 7500,
    variation: 3000,
    peakHours: [14, 15, 16], // 2 PM to 4 PM
    characteristics: {
      acUsage: "40-50% of total demand",
      timeOfPeak: "2:00 PM - 4:00 PM",
      demandIncrease: "15-25% above annual average",
      keyDrivers: ["Air Conditioning", "Refrigeration", "Cooling Systems"],
    },
    insights: [
      "AC usage contributes to 40-50% of urban demand",
      "Peak demand typically reaches 7,000-7,500 MW",
      "Critical monitoring needed during afternoon hours",
      "15-25% higher than annual average demand",
    ],
  },
  monsoon: {
    months: [7, 8, 9], // July to September
    baseLoad: 4000,
    peakLoad: 6000,
    variation: 2000,
    peakHours: [13, 14, 15], // 1 PM to 3 PM
    characteristics: {
      demandDrop: "5-10% lower than summer",
      humidityImpact: "High humidity keeps cooling demand significant",
      timeOfPeak: "1:00 PM - 3:00 PM",
    },
    insights: [
      "5-10% lower demand than summer peaks",
      "High humidity maintains significant cooling demand",
      "More stable grid performance due to moderate temperatures",
      "Evening peaks are less pronounced than summer",
    ],
  },
  winter: {
    months: [12, 1, 2], // December to February
    baseLoad: 2500,
    peakLoad: 4500,
    variation: 2000,
    peakHours: [8, 9, 19, 20], // 8-9 AM and 7-8 PM
    characteristics: {
      demandDrop: "10-15% lower than summer",
      heatingImpact: "5% load increase from heaters",
      peakTimes: "Morning (8-9 AM) and Evening (7-8 PM)",
    },
    insights: [
      "10-15% lower than summer demand levels",
      "Dual peak pattern: morning and evening",
      "Heating devices add approximately 5% to total load",
      "Most stable grid performance period",
    ],
  },
  moderate: {
    months: [3, 10, 11], // March, October, November
    baseLoad: 3500,
    peakLoad: 5500,
    variation: 2000,
    peakHours: [14, 15], // 2 PM to 3 PM
    characteristics: {
      demandPattern: "Moderate and stable",
      timeOfPeak: "2:00 PM - 3:00 PM",
    },
    insights: [
      "Moderate demand with stable patterns",
      "Ideal period for grid maintenance",
      "Balanced morning and evening consumption",
      "Limited weather impact on demand",
    ],
  },
};

// Festival impact on electricity demand
export const DELHI_FESTIVAL_PATTERNS = {
  diwali: {
    months: [10, 11], // October-November
    demandIncrease: "10-15%",
    peakHours: "18:00-22:00",
    characteristics: {
      locationImpact: "Commercial areas see highest surge",
      duration: "5-7 days around main festival",
    },
    insights: [
      "500-1,000 MW additional evening demand",
      "Commercial areas show 15-20% higher consumption",
      "Extended shopping hours increase baseline demand",
      "Decorative lighting drives evening peaks",
    ],
  },
  navratri: {
    months: [9, 10], // September-October (varies)
    demandIncrease: "5-8%",
    peakHours: "18:00-23:00",
    characteristics: {
      locationImpact: "Localized spikes near pandals",
      duration: "9 days",
    },
    insights: [
      "Evening demand increases by 5-8%",
      "Localized spikes near celebration venues",
      "Extended evening activity increases consumption",
      "Commercial areas show sustained higher demand",
    ],
  },
};

// Special events and conditions
export const DELHI_SPECIAL_CONDITIONS = {
  heatwave: {
    possibleMonths: [4, 5, 6], // April to June
    characteristics: {
      demandIncrease: "10-15% above normal summer load",
      duration: "3-7 days typically",
    },
    insights: [
      "Can push demand 500-700 MW above normal",
      "Critical grid stress period",
      "AC usage can spike to 60% of total load",
      "Evening cooldown provides limited relief",
    ],
  },
  coldWave: {
    possibleMonths: [12, 1], // December to January
    characteristics: {
      demandIncrease: "5-10% above normal winter load",
      peakHours: "Morning (7-9 AM) and Night (8-10 PM)",
    },
    insights: [
      "Morning peaks can be 10-15% higher",
      "Heating devices drive demand spikes",
      "Evening peaks more pronounced than normal",
      "Grid stress lower than summer peaks",
    ],
  },
};

// Get relevant insights based on date range
export const getDelhiInsights = (startDate, endDate) => {
  const startMonth = startDate.getMonth() + 1;
  const endMonth = endDate.getMonth() + 1;
  let relevantInsights = [];

  // Function to check if a month falls within the date range
  const isMonthInRange = (month) => {
    if (startMonth <= endMonth) {
      return month >= startMonth && month <= endMonth;
    }
    // Handle year wrap (e.g., Dec to Feb)
    return month >= startMonth || month <= endMonth;
  };

  // Add seasonal insights
  Object.entries(DELHI_SEASONAL_PATTERNS).forEach(([season, data]) => {
    if (data.months.some((month) => isMonthInRange(month))) {
      relevantInsights.push({
        title: `${
          season.charAt(0).toUpperCase() + season.slice(1)
        } Season Analysis`,
        description: data.insights.join(". ") + ".",
        type: "seasonal",
        priority: 1,
      });
    }
  });

  // Add festival insights
  Object.entries(DELHI_FESTIVAL_PATTERNS).forEach(([festival, data]) => {
    if (data.months.some((month) => isMonthInRange(month))) {
      relevantInsights.push({
        title: `${
          festival.charAt(0).toUpperCase() + festival.slice(1)
        } Period Impact`,
        description: data.insights.join(". ") + ".",
        type: "festival",
        priority: 2,
      });
    }
  });

  // Add special condition insights
  Object.entries(DELHI_SPECIAL_CONDITIONS).forEach(([condition, data]) => {
    if (data.possibleMonths.some((month) => isMonthInRange(month))) {
      relevantInsights.push({
        title: `Potential ${
          condition.charAt(0).toUpperCase() + condition.slice(1)
        } Impact`,
        description: data.insights.join(". ") + ".",
        type: "special",
        priority: 3,
      });
    }
  });

  // Add general insights if no specific insights found
  if (relevantInsights.length === 0) {
    relevantInsights.push({
      title: "General Consumption Pattern",
      description:
        "Typical daily peaks occur between 2 PM - 4 PM. Weekend demand is 20-25% lower than weekdays. Base load remains between 2000-2500 MW.",
      type: "general",
      priority: 4,
    });
  }

  // Sort by priority and limit to 6 most relevant insights
  return relevantInsights.sort((a, b) => a.priority - b.priority).slice(0, 6);
};
