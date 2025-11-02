// Exchange rate service for fetching live USD to NGN rates
// Using exchangerate-api.com free tier (1,500 requests/month)

interface ExchangeRateResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: {
    [key: string]: number;
  };
}

interface CachedRate {
  rate: number;
  timestamp: number;
}

// Cache duration: 1 hour (3600000 ms)
const CACHE_DURATION = 60 * 60 * 1000;
const FALLBACK_RATE = 1650; // Fallback rate if API fails

// In-memory cache (in production, consider using Redis or similar)
let cachedRate: CachedRate | null = null;

/**
 * Fetch the latest USD to NGN exchange rate
 * @returns Promise<number> - The exchange rate
 */
export async function fetchExchangeRate(): Promise<number> {
  // Check if we have a valid cached rate
  if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_DURATION) {
    console.log("🔄 Using cached exchange rate:", cachedRate.rate);
    return cachedRate.rate;
  }

  try {
    console.log("🌐 Fetching live exchange rate from API...");

    // Using exchangerate-api.com (free tier)
    // Alternative: https://api.exchangerate-api.com/v4/latest/USD
    const apiUrl =
      process.env.EXCHANGE_RATE_API_URL ||
      "https://open.er-api.com/v6/latest/USD";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: ExchangeRateResponse = await response.json();

    if (data.result === "success" && data.conversion_rates.NGN) {
      const rate = data.conversion_rates.NGN;

      // Cache the rate
      cachedRate = {
        rate,
        timestamp: Date.now(),
      };

      console.log("✅ Fetched live exchange rate:", rate, "NGN per USD");
      console.log("📅 Last updated:", data.time_last_update_utc);

      return rate;
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    console.error("❌ Error fetching exchange rate:", error);
    console.log("⚠️ Using fallback rate:", FALLBACK_RATE);

    // If we have an old cached rate, use it even if expired
    if (cachedRate) {
      console.log("📦 Using expired cached rate:", cachedRate.rate);
      return cachedRate.rate;
    }

    // Return fallback rate
    return FALLBACK_RATE;
  }
}

/**
 * Get the current cached rate without fetching
 * @returns number | null - The cached rate or null if not cached
 */
export function getCachedRate(): number | null {
  if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_DURATION) {
    return cachedRate.rate;
  }
  return null;
}

/**
 * Clear the cached exchange rate
 */
export function clearRateCache(): void {
  cachedRate = null;
  console.log("🗑️ Exchange rate cache cleared");
}

/**
 * Get cache info for debugging
 */
export function getCacheInfo(): {
  hasCachedRate: boolean;
  rate: number | null;
  timestamp: number | null;
  age: number | null;
  isExpired: boolean;
} {
  if (!cachedRate) {
    return {
      hasCachedRate: false,
      rate: null,
      timestamp: null,
      age: null,
      isExpired: true,
    };
  }

  const age = Date.now() - cachedRate.timestamp;
  const isExpired = age >= CACHE_DURATION;

  return {
    hasCachedRate: true,
    rate: cachedRate.rate,
    timestamp: cachedRate.timestamp,
    age,
    isExpired,
  };
}
