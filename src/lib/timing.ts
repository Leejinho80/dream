import type { TimingLevel, TimingResult } from "@/types";
import type { StockHistory } from "@/types";

export function calcProfitRate(currentPrice: number, avgPrice: number): number {
  return ((currentPrice - avgPrice) / avgPrice) * 100;
}

export function getSellTiming(profitRate: number): TimingResult {
  if (profitRate >= 15) return { level: "great", label: "아주좋음" };
  if (profitRate >= 5) return { level: "good", label: "좋음" };
  if (profitRate >= -5) return { level: "bad", label: "나쁨" };
  return { level: "terrible", label: "매우나쁨" };
}

export function getBuyTimingFromProfit(profitRate: number): TimingResult {
  if (profitRate >= 15) return { level: "terrible", label: "매우나쁨" };
  if (profitRate >= 5) return { level: "bad", label: "나쁨" };
  if (profitRate >= -5) return { level: "good", label: "좋음" };
  return { level: "great", label: "아주좋음" };
}

export function getBuyTimingFromHistory(
  currentPrice: number,
  history: StockHistory[]
): TimingResult {
  if (history.length === 0) return { level: "good", label: "좋음" };

  const closes = history.map((h) => h.close);
  const minPrice = Math.min(...closes);
  const maxPrice = Math.max(...closes);
  const avgPrice = closes.reduce((a, b) => a + b, 0) / closes.length;

  const fromMin = ((currentPrice - minPrice) / minPrice) * 100;
  const fromMax = ((maxPrice - currentPrice) / maxPrice) * 100;

  if (fromMin <= 10) return { level: "great", label: "아주좋음" };
  if (currentPrice <= avgPrice) return { level: "good", label: "좋음" };
  if (fromMax <= 10) return { level: "terrible", label: "매우나쁨" };
  return { level: "bad", label: "나쁨" };
}

export function getLevelColor(level: TimingLevel): string {
  switch (level) {
    case "great": return "text-green-400";
    case "good": return "text-yellow-400";
    case "bad": return "text-orange-400";
    case "terrible": return "text-red-400";
  }
}

export function getLevelBg(level: TimingLevel): string {
  switch (level) {
    case "great": return "bg-green-500";
    case "good": return "bg-yellow-500";
    case "bad": return "bg-orange-500";
    case "terrible": return "bg-red-500";
  }
}
