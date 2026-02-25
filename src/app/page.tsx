import StockSearch from "@/components/stock/StockSearch";
import StockList from "@/components/stock/StockList";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">관심 종목</h1>
          <p className="text-gray-400">
            KOSPI/KOSDAQ 종목을 추가하고 주가와 뉴스를 확인하세요.
            <span className="ml-2 text-xs text-yellow-500 bg-yellow-900/30 px-2 py-0.5 rounded">
              매일 장 마감 후 갱신
            </span>
          </p>
        </div>

        {/* 종목 검색 */}
        <div className="mb-8 max-w-lg">
          <StockSearch />
        </div>

        {/* 관심 종목 그리드 */}
        <StockList />
      </div>
    </main>
  );
}
