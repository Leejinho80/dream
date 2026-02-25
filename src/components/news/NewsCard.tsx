import type { NewsItem } from "@/types";

interface Props {
  news: NewsItem;
}

function formatDate(pubDate: string): string {
  if (!pubDate) return "";
  try {
    const d = new Date(pubDate);
    return d.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return pubDate;
  }
}

export default function NewsCard({ news }: Props) {
  return (
    <a
      href={news.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-gray-750 transition-all group"
    >
      <h3 className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
        {news.title}
      </h3>
      {news.description && (
        <p className="text-gray-400 text-xs line-clamp-2 mb-3">{news.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{news.source ?? "네이버 금융"}</span>
        <span>{formatDate(news.pubDate)}</span>
      </div>
    </a>
  );
}
