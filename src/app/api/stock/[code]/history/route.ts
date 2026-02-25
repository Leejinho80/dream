import { NextRequest, NextResponse } from "next/server";
import { fetchStockHistory } from "@/lib/yahoo-finance";
import { toYahooCode } from "@/lib/stock-utils";

export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const market = (request.nextUrl.searchParams.get("market") as "KOSPI" | "KOSDAQ") ?? "KOSPI";

  try {
    const yahooCode = toYahooCode(params.code, market);
    const history = await fetchStockHistory(yahooCode);

    return NextResponse.json({ history }, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Stock history fetch error:", error);
    return NextResponse.json({ error: "히스토리 데이터를 가져올 수 없습니다." }, { status: 500 });
  }
}
