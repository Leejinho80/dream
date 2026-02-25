import type { NewsItem } from "@/types";
import NewsCard from "./NewsCard";

interface Props {
  news: NewsItem[];
}

export default function NewsList({ news }: Props) {
  if (!news || news.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        뉴스를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {news.map((item, idx) => (
        <NewsCard key={idx} news={item} />
      ))}
    </div>
  );
}
