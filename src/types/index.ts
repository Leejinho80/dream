export type TimingLevel = "great" | "good" | "bad" | "terrible";

export interface TimingResult {
  level: TimingLevel;
  label: string;
}

export interface WatchlistItem {
  code: string;
  yahooCode: string;
  name: string;
  market: "KOSPI" | "KOSDAQ";
  addedAt: string;
  avgPrice?: number;
}

export interface StockQuote {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  updatedAt: string;
}

export interface StockHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source?: string;
}
