/* eslint-disable @typescript-eslint/no-explicit-any */
import YahooFinanceCls from "yahoo-finance2";
import type { StockQuote, StockHistory } from "@/types";

const yf = new (YahooFinanceCls as any)();

export async function fetchStockQuote(yahooCode: string): Promise<StockQuote> {
  const result = (await yf.quote(yahooCode)) as Record<string, any>;

  return {
    code: yahooCode.replace(/\.(KS|KQ)$/, ""),
    name: result.shortName ?? result.longName ?? yahooCode,
    price: result.regularMarketPrice ?? 0,
    change: result.regularMarketChange ?? 0,
    changePercent: result.regularMarketChangePercent ?? 0,
    volume: result.regularMarketVolume ?? 0,
    marketCap: result.marketCap ?? undefined,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchStockHistory(yahooCode: string): Promise<StockHistory[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);

  const result = (await yf.historical(yahooCode, {
    period1: startDate.toISOString().split("T")[0],
    period2: endDate.toISOString().split("T")[0],
    interval: "1d",
  })) as Array<Record<string, any>>;

  return result.map((item) => ({
    date: new Date(item.date).toISOString().split("T")[0],
    open: item.open ?? 0,
    high: item.high ?? 0,
    low: item.low ?? 0,
    close: item.close ?? 0,
    volume: item.volume ?? 0,
  }));
}
