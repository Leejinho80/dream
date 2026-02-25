import Link from "next/link";
import StockChart from "@/components/stock/StockChart";
import NewsList from "@/components/news/NewsList";
import NewsAnalysis from "@/components/stock/NewsAnalysis";
import type { StockHistory, NewsItem } from "@/types";
import { calcProfitRate, getSellTiming, getBuyTimingFromProfit, getBuyTimingFromHistory } from "@/lib/timing";
import TimingSignal from "@/components/stock/TimingSignal";

interface Props {
  params: { code: string };
  searchParams: { market?: string; avgPrice?: string };
}

export const revalidate = 0;

async function getStockData(code: string, market: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001");

  const [priceRes, historyRes, newsRes] = await Promise.allSettled([
    fetch(`${baseUrl}/api/stock/${code}/price?market=${market}`, {
      cache: "no-store",
    }),
    fetch(`${baseUrl}/api/stock/${code}/history?market=${market}`, {
      cache: "no-store",
    }),
    fetch(`${baseUrl}/api/news/${code}`, {
      cache: "no-store",
    }),
  ]);

  const price = priceRes.status === "fulfilled" ? await priceRes.value.json() : null;
  const historyData = historyRes.status === "fulfilled" ? await historyRes.value.json() : { history: [] };
  const newsData = newsRes.status === "fulfilled" ? await newsRes.value.json() : { news: [] };

  return {
    price,
    history: (historyData.history ?? []) as StockHistory[],
    news: (newsData.news ?? []) as NewsItem[],
  };
}

export default async function StockDetailPage({ params, searchParams }: Props) {
  const market = searchParams.market ?? "KOSPI";
  const avgPrice = searchParams.avgPrice ? Number(searchParams.avgPrice) : undefined;
  const { price, history, news } = await getStockData(params.code, market);

  const firstClose = history[0]?.close ?? 0;
  const lastClose = history[history.length - 1]?.close ?? 0;
  const chartColor = lastClose >= firstClose ? "#ef4444" : "#3b82f6";

  // 타이밍 계산
  const currentPrice = price?.price ?? 0;
  const hasAvgPrice = avgPrice != null && avgPrice > 0;
  const profitRate = hasAvgPrice && currentPrice > 0
    ? calcProfitRate(currentPrice, avgPrice!)
    : null;

  const sellTiming = profitRate !== null ? getSellTiming(profitRate) : null;
  const buyTiming = currentPrice > 0
    ? profitRate !== null
      ? getBuyTimingFromProfit(profitRate)
      : getBuyTimingFromHistory(currentPrice, history)
    : null;

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 뒤로가기 */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors text-sm"
        >
          ← 관심 종목 목록
        </Link>

        {/* 종목 헤더 */}
        {price && !price.error && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{price.name}</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {params.code} &middot;{" "}
                  <span className={market === "KOSPI" ? "text-blue-400" : "text-purple-400"}>
                    {market}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {price.price.toLocaleString("ko-KR")}
                  <span className="text-sm text-gray-400 font-normal ml-1">원</span>
                </div>

                {/* 수익률 (평단가 있을 때) */}
                {hasAvgPrice && profitRate !== null && (
                  <div className={`text-sm mt-1 font-semibold ${profitRate >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {profitRate >= 0 ? "+" : ""}{profitRate.toFixed(2)}%
                    {" "}· 평단가 기준
                  </div>
                )}

                {/* 전일 등락률 */}
                <div className={`text-sm mt-0.5 font-medium ${price.changePercent >= 0 ? "text-red-400" : "text-blue-400"}`}>
                  {price.changePercent >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(price.changePercent).toFixed(2)}%{" "}
                  ({price.changePercent >= 0 ? "+" : ""}{price.change.toLocaleString("ko-KR")})
                  {" "}· 전일 기준
                </div>

                {hasAvgPrice && (
                  <div className="text-xs text-gray-500 mt-1">
                    평단가 {avgPrice!.toLocaleString()}원
                  </div>
                )}
              </div>
            </div>

            {/* 타이밍 신호등 */}
            {buyTiming && (
              <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-700">
                <span className="text-xs text-gray-400">타이밍 분석</span>
                <div className="flex gap-4">
                  {sellTiming && (
                    <TimingSignal type="sell" level={sellTiming.level} label={sellTiming.label} />
                  )}
                  <TimingSignal type="buy" level={buyTiming.level} label={buyTiming.label} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 차트 */}
        <section className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">최근 1개월 주가</h2>
          <StockChart data={history} color={chartColor} avgPrice={avgPrice} />
        </section>

        {/* 뉴스 + 분석 (PC: 2열, 모바일: 스택) */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* 호재/악재 분석 */}
          <section className="md:w-2/5">
            <h2 className="text-lg font-semibold text-white mb-4">뉴스 분석</h2>
            {news.length > 0 ? (
              <NewsAnalysis news={news} />
            ) : (
              <p className="text-gray-500 text-sm">분석할 뉴스가 없습니다.</p>
            )}
          </section>

          {/* 전체 뉴스 목록 */}
          <section className="md:flex-1">
            <h2 className="text-lg font-semibold text-white mb-4">관련 뉴스</h2>
            <NewsList news={news} />
          </section>
        </div>
      </div>
    </main>
  );
}
