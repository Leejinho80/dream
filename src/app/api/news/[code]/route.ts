import { NextRequest, NextResponse } from "next/server";
import { fetchStockNews } from "@/lib/naver-rss";

export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const name = request.nextUrl.searchParams.get("name") ?? undefined;
    const news = await fetchStockNews(params.code, name);
    return NextResponse.json({ news }, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({ error: "뉴스를 가져올 수 없습니다." }, { status: 500 });
  }
}
