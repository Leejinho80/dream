import { NextRequest, NextResponse } from "next/server";
import { fetchStockQuote } from "@/lib/yahoo-finance";
import { toYahooCode } from "@/lib/stock-utils";

// 캐시 없음: 매 요청마다 Yahoo Finance에서 실시간(~15분 지연) 데이터 조회
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const market = (request.nextUrl.searchParams.get("market") as "KOSPI" | "KOSDAQ") ?? "KOSPI";

  try {
    const yahooCode = toYahooCode(params.code, market);
    const quote = await fetchStockQuote(yahooCode);

    return NextResponse.json(quote, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Stock price fetch error:", error);
    return NextResponse.json({ error: "주가 데이터를 가져올 수 없습니다." }, { status: 500 });
  }
}
