import type { NextApiRequest, NextApiResponse } from "next";
import {
  fetchExchangeRate,
  getCachedRate,
  clearRateCache,
  getCacheInfo,
} from "../../lib/exchangeRates";

type ResponseData = {
  success: boolean;
  rate?: number;
  cacheInfo?: any;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    try {
      // Get query parameter to force refresh
      const forceRefresh = req.query.refresh === "true";

      let rate: number;

      if (forceRefresh) {
        // Clear cache and fetch fresh rate
        clearRateCache();
        rate = await fetchExchangeRate();
      } else {
        // Try to get cached rate first
        const cachedRate = getCachedRate();
        if (cachedRate) {
          rate = cachedRate;
        } else {
          // Fetch if no valid cache
          rate = await fetchExchangeRate();
        }
      }

      const cacheInfo = getCacheInfo();

      return res.status(200).json({
        success: true,
        rate,
        cacheInfo,
        message: forceRefresh
          ? "Fresh exchange rate fetched"
          : "Exchange rate retrieved",
      });
    } catch (error) {
      console.error("Error in exchange rate API:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch exchange rate",
      });
    }
  } else if (req.method === "POST") {
    // Manual cache clear endpoint (admin only in production)
    try {
      clearRateCache();
      const rate = await fetchExchangeRate();

      return res.status(200).json({
        success: true,
        rate,
        message: "Cache cleared and fresh rate fetched",
      });
    } catch (error) {
      console.error("Error clearing cache:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to clear cache and fetch rate",
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }
}
