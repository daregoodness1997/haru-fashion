import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchExchangeRate } from "../lib/exchangeRates";

type Currency = "USD" | "NGN";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (priceInUSD: number) => string;
  exchangeRate: number;
  isLoadingRate: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

// Default exchange rate as fallback
const DEFAULT_USD_TO_NGN_RATE = 1650;

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [exchangeRate, setExchangeRate] = useState(DEFAULT_USD_TO_NGN_RATE);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  // Fetch live exchange rate from API
  useEffect(() => {
    const loadExchangeRate = async () => {
      setIsLoadingRate(true);
      try {
        const rate = await fetchExchangeRate();
        setExchangeRate(rate);
      } catch (error) {
        console.error("Failed to load exchange rate:", error);
        // Keep default rate
      } finally {
        setIsLoadingRate(false);
      }
    };

    loadExchangeRate();

    // Refresh rate every hour
    const interval = setInterval(loadExchangeRate, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Load currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") as Currency;
    if (savedCurrency === "USD" || savedCurrency === "NGN") {
      setCurrency(savedCurrency);
    }
  }, []);

  // Save currency preference to localStorage
  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  // Convert USD to selected currency
  const convertPrice = (priceInUSD: number): number => {
    if (currency === "NGN") {
      return priceInUSD * exchangeRate;
    }
    return priceInUSD;
  };

  // Format price with currency symbol
  const formatPrice = (priceInUSD: number): string => {
    const convertedPrice = convertPrice(priceInUSD);

    if (currency === "NGN") {
      // Format for Naira: ₦1,650.00
      return `₦${convertedPrice.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    // Format for USD: $1.00
    return `$${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        convertPrice,
        formatPrice,
        exchangeRate,
        isLoadingRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
