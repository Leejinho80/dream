import type { Metadata } from "next";
import "./globals.css";
import { WatchlistProvider } from "@/context/WatchlistContext";

export const metadata: Metadata = {
  title: "주식 관심 종목 트래커",
  description: "KOSPI/KOSDAQ 관심 종목 주가 및 뉴스 트래킹",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-900 min-h-screen">
        <WatchlistProvider>{children}</WatchlistProvider>
      </body>
    </html>
  );
}
