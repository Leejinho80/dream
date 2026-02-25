import { NextRequest, NextResponse } from "next/server";

// Vercel Cron: UTC 23:00 = KST 08:00 매일 실행
// 현재 no-cache 구조이므로 실행 시점 기록만 수행 (추후 사전 캐싱 등으로 확장 가능)

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  // Vercel이 보내는 Authorization 헤더 검증 (배포 환경)
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = new Date().toISOString();
  console.log(`[Cron] Daily update triggered at ${timestamp} (KST: ${toKST(timestamp)})`);

  return NextResponse.json({
    ok: true,
    message: "Cron job executed successfully",
    timestamp,
    kst: toKST(timestamp),
  });
}

function toKST(isoString: string): string {
  return new Date(isoString).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
}
