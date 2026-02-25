"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import StockCard from "./StockCard";

export default function StockList() {
  const { watchlist } = useWatchlist();

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-600 text-6xl mb-4">📈</div>
        <p className="text-gray-400 text-lg">관심 종목이 없습니다.</p>
        <p className="text-gray-500 text-sm mt-2">위 검색창에서 종목을 추가해보세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {watchlist.map((item) => (
        <StockCard key={item.code} item={item} />
      ))}
    </div>
  );
}
