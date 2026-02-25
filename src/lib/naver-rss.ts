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

// 증권 뉴스 RSS 소스 목록
const RSS_SOURCES = [
  { url: "https://www.yna.co.kr/rss/economy.xml", source: "연합뉴스" },
  { url: "https://www.yna.co.kr/rss/stock.xml", source: "연합뉴스 증권" },
];

export async function fetchStockNews(code: string, limit = 10): Promise<NewsItem[]> {
  // 각 RSS 소스를 순서대로 시도
  for (const { url, source } of RSS_SOURCES) {
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
