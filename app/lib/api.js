export async function getPredictions(date) {
  try {
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch predictions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching predictions:", error);
    throw error;
  }
}
