import { NextResponse } from "next/server";
import { fetchStockNews } from "@/lib/naver-rss";

export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const news = await fetchStockNews(params.code);
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
