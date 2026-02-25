import type { NewsItem } from "@/types";

const POSITIVE_KEYWORDS = [
  "상승", "급등", "흑자", "최대", "성장", "수주", "계약", "개발", "신제품",
  "허가", "승인", "매출", "영업이익", "흑자전환", "신고가", "호실적", "증가",
  "확대", "수출", "투자", "협약", "파트너", "상향",
];

const NEGATIVE_KEYWORDS = [
  "하락", "급락", "적자", "손실", "소송", "리콜", "조사", "혐의", "규제",
  "제재", "부진", "감소", "하향", "취소", "신저가", "적자전환", "경고",
  "우려", "위기", "악화", "하락세", "매출감소",
];

export interface AnalyzedNews {
  item: NewsItem;
  sentiment: "positive" | "negative" | "neutral";
  matchedKeywords: string[];
}

export interface NewsAnalysisResult {
  positive: AnalyzedNews[];
  negative: AnalyzedNews[];
  neutral: AnalyzedNews[];
}

function analyzeItem(item: NewsItem): AnalyzedNews {
  const text = `${item.title} ${item.description}`;

  const positiveMatches = POSITIVE_KEYWORDS.filter((kw) => text.includes(kw));
  const negativeMatches = NEGATIVE_KEYWORDS.filter((kw) => text.includes(kw));

  let sentiment: "positive" | "negative" | "neutral" = "neutral";
  if (positiveMatches.length > negativeMatches.length) sentiment = "positive";
  else if (negativeMatches.length > positiveMatches.length) sentiment = "negative";
  else if (positiveMatches.length > 0) sentiment = "positive";

  return {
    item,
    sentiment,
    matchedKeywords: [...positiveMatches, ...negativeMatches],
  };
}

export function analyzeNews(news: NewsItem[]): NewsAnalysisResult {
  const analyzed = news.map(analyzeItem);
  return {
    positive: analyzed.filter((a) => a.sentiment === "positive"),
    negative: analyzed.filter((a) => a.sentiment === "negative"),
    neutral: analyzed.filter((a) => a.sentiment === "neutral"),
  };
}

export function getOutlookText(
  positiveCount: number,
  negativeCount: number
): string {
  const total = positiveCount + negativeCount;
  if (total === 0) return "관련 뉴스가 부족하여 전망을 분석하기 어렵습니다.";

  const ratio = positiveCount / total;
  if (ratio >= 0.7)
    return `호재 ${positiveCount}건 / 악재 ${negativeCount}건 기준 — 단기 상승 우세`;
  if (ratio >= 0.5)
    return `호재 ${positiveCount}건 / 악재 ${negativeCount}건 기준 — 소폭 상승 우세`;
  if (ratio >= 0.3)
    return `호재 ${positiveCount}건 / 악재 ${negativeCount}건 기준 — 소폭 하락 우세`;
  return `호재 ${positiveCount}건 / 악재 ${negativeCount}건 기준 — 단기 하락 우세`;
}
