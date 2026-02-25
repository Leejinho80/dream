import Parser from "rss-parser";
import type { NewsItem } from "@/types";

const parser = new Parser({
  customFields: {
    item: ["description", "pubDate"],
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

// 구글 뉴스 RSS 제목에서 언론사 추출 ("제목 - 언론사" 형식)
function extractSource(title: string): string {
  const match = title.match(/ - ([^-]+)$/);
  return match ? match[1].trim() : "Google 뉴스";
}

function cleanTitle(title: string): string {
  return title.replace(/ - [^-]+$/, "").trim();
}

// 폴백용 일반 증권 뉴스 소스
const FALLBACK_SOURCES = [
  { url: "https://www.yna.co.kr/rss/economy.xml", source: "연합뉴스" },
  { url: "https://www.yna.co.kr/rss/stock.xml", source: "연합뉴스 증권" },
];

export async function fetchStockNews(
  code: string,
  stockName?: string,
  limit = 10
): Promise<NewsItem[]> {
  // 종목명이 있으면 구글 뉴스에서 종목 관련 뉴스 검색
  if (stockName) {
    try {
      const query = encodeURIComponent(`${stockName} 주가`);
      const url = `https://news.google.com/rss/search?q=${query}&hl=ko&gl=KR&ceid=KR:ko`;
      const feed = await parser.parseURL(url);

      const items: NewsItem[] = feed.items.slice(0, limit).map((item) => {
        const rawTitle = item.title ?? "";
        return {
          title: cleanTitle(stripHtml(rawTitle)),
          link: item.link ?? "",
          description: stripHtml(item.contentSnippet ?? item.description ?? ""),
          pubDate: item.pubDate ?? "",
          source: extractSource(rawTitle),
        };
      });

      if (items.length > 0) return items;
    } catch {
      // 구글 뉴스 실패 시 폴백
    }
  }

  // 폴백: 일반 증권 뉴스 RSS
  for (const { url, source } of FALLBACK_SOURCES) {
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items.slice(0, limit).map((item) => ({
        title: stripHtml(item.title ?? ""),
        link: item.link ?? "",
        description: stripHtml(item.contentSnippet ?? item.description ?? ""),
        pubDate: item.pubDate ?? "",
        source,
      }));
      if (items.length > 0) return items;
    } catch {
      continue;
    }
  }

  return [];
}
