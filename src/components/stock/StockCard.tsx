"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { WatchlistItem, StockQuote, StockHistory } from "@/types";
import { useWatchlist } from "@/context/WatchlistContext";
import TimingSignal from "@/components/stock/TimingSignal";
import AvgPriceModal from "@/components/stock/AvgPriceModal";
import {
  calcProfitRate,
  getSellTiming,
  getBuyTimingFromProfit,
  getBuyTimingFromHistory,
} from "@/lib/timing";

interface Props {
  item: WatchlistItem;
}

export default function StockCard({ item }: Props) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { dispatch } = useWatchlist();

  useEffect(() => {
    Promise.all([
      fetch(`/api/stock/${item.code}/price?market=${item.market}`).then((r) => r.json()),
      fetch(`/api/stock/${item.code}/history?market=${item.market}`).then((r) => r.json()),
    ])
      .then(([priceData, histData]) => {
        if (!priceData.error) setQuote(priceData);
        if (Array.isArray(histData?.history)) setHistory(histData.history);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [item.code, item.market]);

  const handleSaveAvgPrice = (price: number | undefined) => {
    dispatch({ type: "SET_AVG_PRICE", code: item.code, price });
  };

  // 수익률/타이밍 계산
  const hasAvgPrice = item.avgPrice != null && item.avgPrice > 0;
  const profitRate = hasAvgPrice && quote
    ? calcProfitRate(quote.price, item.avgPrice!)
    : null;

  const sellTiming = profitRate !== null ? getSellTiming(profitRate) : null;
  const buyTiming = quote
    ? profitRate !== null
      ? getBuyTimingFromProfit(profitRate)
      : getBuyTimingFromHistory(quote.price, history)
    : null;

  const detailHref = hasAvgPrice
    ? `/stock/${item.code}?market=${item.market}&avgPrice=${item.avgPrice}`
    : `/stock/${item.code}?market=${item.market}`;

  return (
    <>
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg">
        {/* 헤더 */}
        <div className="flex justify-between items-start mb-3">
          <Link href={detailHref} className="group min-w-0">
            <h3 className="text-white font-semibold text-base leading-tight group-hover:text-blue-400 transition-colors truncate">
              {item.name}
            </h3>
            <span className="text-gray-400 text-xs mt-0.5 block">
              {item.code} &middot;{" "}
              <span className={item.market === "KOSPI" ? "text-blue-400" : "text-purple-400"}>
                {item.market}
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <button
              onClick={() => setShowModal(true)}
              title="평단가 설정"
              className="text-gray-400 hover:text-yellow-400 transition-colors p-1.5 rounded-lg hover:bg-yellow-400/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => dispatch({ type: "REMOVE", payload: item.code })}
              title="종목 삭제"
              className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-400/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 mb-3">
            <div className="animate-pulse h-8 bg-gray-700 rounded w-32" />
            <div className="animate-pulse h-4 bg-gray-700 rounded w-20" />
          </div>
        ) : quote ? (
          <>
            {/* 현재가 */}
            <div className="mb-2">
              <div className="text-2xl font-bold text-white">
                {quote.price.toLocaleString("ko-KR")}
                <span className="text-sm text-gray-400 font-normal ml-1">원</span>
              </div>

              {/* 수익률 (평단가 있을 때) */}
              {hasAvgPrice && profitRate !== null && (
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-sm font-semibold ${
                      profitRate >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {profitRate >= 0 ? "+" : ""}{profitRate.toFixed(2)}%
                    {profitRate >= 0 ? " ↑" : " ↓"}
                  </span>
                  <span className="text-xs text-gray-500">평단가 기준</span>
                </div>
              )}

              {/* 전일 대비 등락률 */}
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-sm ${
                    quote.changePercent >= 0 ? "text-red-400" : "text-blue-400"
                  }`}
                >
                  {quote.changePercent >= 0 ? "+" : ""}{quote.changePercent.toFixed(2)}%
                  {" "}({quote.change >= 0 ? "+" : ""}{quote.change.toLocaleString()})
                </span>
                <span className="text-xs text-gray-500">전일 기준</span>
              </div>

              {/* 평단가 표시 */}
              {hasAvgPrice && (
                <div className="text-xs text-gray-500 mt-0.5">
                  평단가 {item.avgPrice!.toLocaleString()}원
                </div>
              )}
            </div>

            {/* 타이밍 신호등 */}
            {buyTiming && (
              <div className="flex items-center gap-4 pt-2 border-t border-gray-700 mt-2">
                {sellTiming && (
                  <TimingSignal type="sell" level={sellTiming.level} label={sellTiming.label} />
                )}
                <TimingSignal type="buy" level={buyTiming.level} label={buyTiming.label} />
                {!hasAvgPrice && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="ml-auto text-xs text-yellow-400/70 hover:text-yellow-400 transition-colors"
                  >
                    + 평단가 등록
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-sm">데이터를 불러올 수 없습니다.</p>
        )}

        {/* 하단 링크 */}
        <div className="mt-3 pt-2 border-t border-gray-700">
          <Link
            href={detailHref}
            className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
          >
            차트 및 뉴스 보기 →
          </Link>
        </div>
      </div>

      {/* 평단가 입력 모달 */}
      {showModal && quote && (
        <AvgPriceModal
          item={item}
          currentPrice={quote.price}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAvgPrice}
        />
      )}
    </>
  );
}
