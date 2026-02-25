"use client";

import type { NewsItem } from "@/types";
import { analyzeNews, getOutlookText } from "@/lib/news-analysis";

interface Props {
  news: NewsItem[];
}

export default function NewsAnalysis({ news }: Props) {
  const { positive, negative, neutral } = analyzeNews(news);
  const outlookText = getOutlookText(positive.length, negative.length);

  return (
    <div className="space-y-4">
      {/* 전망 요약 */}
      <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">종합 전망</h3>
        <p className="text-white text-sm leading-relaxed">{outlookText}</p>
        <div className="flex gap-3 mt-3 text-xs">
          <span className="text-green-400">호재 {positive.length}건</span>
          <span className="text-red-400">악재 {negative.length}건</span>
          <span className="text-gray-400">중립 {neutral.length}건</span>
        </div>
      </div>

      {/* 호재 뉴스 */}
      {positive.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
            호재 뉴스
          </h3>
          <ul className="space-y-2">
            {positive.map(({ item, matchedKeywords }) => (
              <li key={item.link} className="bg-gray-800 rounded-lg p-3 border border-green-900/40">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white hover:text-green-300 transition-colors leading-snug block"
                >
                  {item.title}
                </a>
                {matchedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {matchedKeywords.slice(0, 4).map((kw) => (
                      <span key={kw} className="text-xs bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
                <span className="text-xs text-gray-500 mt-1 block">{item.source} · {formatDate(item.pubDate)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 악재 뉴스 */}
      {negative.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-400 rounded-full inline-block" />
            악재 뉴스
          </h3>
          <ul className="space-y-2">
            {negative.map(({ item, matchedKeywords }) => (
              <li key={item.link} className="bg-gray-800 rounded-lg p-3 border border-red-900/40">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white hover:text-red-300 transition-colors leading-snug block"
                >
                  {item.title}
                </a>
                {matchedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {matchedKeywords.slice(0, 4).map((kw) => (
                      <span key={kw} className="text-xs bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
                <span className="text-xs text-gray-500 mt-1 block">{item.source} · {formatDate(item.pubDate)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatDate(pubDate: string): string {
  try {
    return new Date(pubDate).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return pubDate;
  }
}
