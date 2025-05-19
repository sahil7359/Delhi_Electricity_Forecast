// Weather-based insights
export const weatherInsights = {
  summer: {
    months: [4, 5, 6, 7], // April to July
    title: "Summer Peak Usage",
    description:
      "Extreme demand period with peak loads of 7,500-8,000 MW due to widespread AC usage. Critical monitoring needed between 1 PM - 5 PM.",
    peakDemand: "7,500-8,000 MW",
    keyFactors: ["Air Conditioning", "Refrigeration", "Cooling Systems"],
  },
  monsoon: {
    months: [7, 8, 9], // July to September
    title: "Monsoon Period Analysis",
    description:
      "Moderate demand due to humidity (6,000-6,500 MW). High dehumidifier and fan usage despite reduced AC operation.",
    peakDemand: "6,000-6,500 MW",
    keyFactors: ["Humidity Control", "Fans", "Dehumidifiers"],
  },
  winter: {
    months: [11, 12, 1, 2], // November to February
    title: "Winter Consumption Pattern",
    description:
      "Base demand of 4,000-5,000 MW with morning peaks due to heating appliances. Lowest overall consumption period.",
    peakDemand: "4,000-5,000 MW",
    keyFactors: ["Heating", "Geysers", "Morning Peak Usage"],
  },
  spring_autumn: {
    months: [3, 10], // March and October
    title: "Moderate Season Analysis",
    description:
      "Balanced demand period (5,000-6,000 MW) with moderate appliance usage. Ideal for grid maintenance.",
    peakDemand: "5,000-6,000 MW",
    keyFactors: ["Moderate Cooling", "Ventilation"],
  },
};

// Festival-based insights
export const festivalInsights = {
  diwali: {
    months: [10, 11], // October-November
    title: "Diwali Season Impact",
    description:
      "10-20% surge in evening consumption (6-10 PM) due to decorative lighting and extended commercial hours.",
    demandIncrease: "10-20%",
    peakHours: "18:00-22:00",
  },
  navratri: {
    months: [9, 10], // September-October
    title: "Navratri Demand Pattern",
    description:
      "Evening demand spikes from pandals and events. Commercial areas show 15% higher consumption.",
    demandIncrease: "15%",
    peakHours: "18:00-23:00",
  },
  christmas_newyear: {
    months: [12], // December
    title: "Year-End Celebrations",
    description:
      "Commercial hubs experience 25% higher evening consumption. Extended mall hours increase baseline demand.",
    demandIncrease: "25%",
    peakHours: "17:00-23:00",
  },
};

// Activity-based insights
export const activityInsights = {
  commercial: {
    title: "Commercial Activity Impact",
    description:
      "Peak demand during 10 AM - 6 PM on weekdays. IT parks and commercial complexes drive 30% of total consumption.",
    peakHours: "10:00-18:00",
    keyMetrics: {
      weekdayIncrease: "25%",
      baselineConsumption: "2000 MW",
    },
  },
  industrial: {
    title: "Industrial Load Pattern",
    description:
      "Consistent 24/7 baseline of 2000 MW with 15% higher consumption during weekdays.",
    peakHours: "All Day",
    keyMetrics: {
      weekdayIncrease: "15%",
      baselineConsumption: "2000 MW",
    },
  },
  special_events: {
    title: "Special Events Analysis",
    description:
      "Exam seasons (March-April) show 10% higher night consumption. Political rallies cause localized 20-30% spikes.",
    eventTypes: ["Exams", "Rallies", "Public Gatherings"],
    impactRange: "10-30%",
  },
};

// Helper function to get month from date
export const getMonthFromDate = (date) => {
  return date.getMonth() + 1; // JavaScript months are 0-based
};

// Helper function to get relevant insights based on date
export const getRelevantInsights = (startDate, endDate) => {
  const startMonth = getMonthFromDate(startDate);
  const endMonth = getMonthFromDate(endDate);

  let relevantInsights = [];

  // Add weather insights
  Object.values(weatherInsights).forEach((insight) => {
    if (
      insight.months.some(
        (month) =>
          (month >= startMonth && month <= endMonth) ||
          (endMonth < startMonth && (month >= startMonth || month <= endMonth))
      )
    ) {
      relevantInsights.push({
        title: insight.title,
        description: insight.description,
      });
    }
  });

  // Add festival insights
  Object.values(festivalInsights).forEach((insight) => {
    if (
      insight.months.some(
        (month) =>
          (month >= startMonth && month <= endMonth) ||
          (endMonth < startMonth && (month >= startMonth || month <= endMonth))
      )
    ) {
      relevantInsights.push({
        title: insight.title,
        description: insight.description,
      });
    }
  });

  // Always add activity insights as they're relevant year-round
  Object.values(activityInsights).forEach((insight) => {
    relevantInsights.push({
      title: insight.title,
      description: insight.description,
    });
  });

  // If no specific insights found, return general insights
  if (relevantInsights.length === 0) {
    relevantInsights = [
      {
        title: "General Consumption Pattern",
        description:
          "Typical daily peak: 2 PM - 4 PM. Weekend demand 20-25% lower than weekdays. Base load: 2000-2500 MW.",
      },
      {
        title: "Grid Performance",
        description:
          "Most stable period: 11 PM - 5 AM. Critical monitoring during afternoon peaks.",
      },
    ];
  }

  // Limit to 6 most relevant insights
  return relevantInsights.slice(0, 6);
};
