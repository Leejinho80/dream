import { NextRequest, NextResponse } from "next/server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import YahooFinanceCls from "yahoo-finance2";

const yf = new (YahooFinanceCls as any)({ suppressNotices: ["yahooSurvey"] });

// 6자리 숫자 코드인지 확인
function isKoreanCode(q: string): boolean {
  return /^\d{5,6}$/.test(q.trim());
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // 숫자 코드 입력 시 Yahoo Finance에서 직접 조회
  if (isKoreanCode(q)) {
    const code = q.padStart(6, "0");
    const candidates = [`${code}.KS`, `${code}.KQ`];

    const results = [];
    for (const symbol of candidates) {
      try {
        const quote = (await yf.quote(symbol)) as Record<string, any>;
        const name = quote.shortName ?? quote.longName ?? "";
        // 이름이 없거나 쉼표가 포함된 잘못된 결과 제외
        if (quote && quote.regularMarketPrice && name && !name.includes(",")) {
          results.push({
            code,
            name,
            market: symbol.endsWith(".KS") ? "KOSPI" : "KOSDAQ",
            yahooCode: symbol,
          });
        }
      } catch {
        // 해당 시장에 없는 경우 skip
      }
    }
    return NextResponse.json({ results });
  }

  return NextResponse.json({ results: [] });
}
