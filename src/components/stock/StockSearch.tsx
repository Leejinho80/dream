"use client";

import { useState, useEffect, useRef } from "react";
import { useWatchlist } from "@/context/WatchlistContext";
import { toYahooCode } from "@/lib/stock-utils";
import { ALL_STOCKS } from "@/data/stocks";

interface Stock {
  code: string;
  name: string;
  market: "KOSPI" | "KOSDAQ";
}

function isKoreanCode(q: string): boolean {
  return /^\d{5,6}$/.test(q.trim());
}

export default function StockSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { dispatch } = useWatchlist();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();

    if (q.length < 1) {
      setSuggestions([]);
      return;
    }

    // 로컬 리스트 즉시 검색 (이름 또는 코드 일치)
    const local = ALL_STOCKS.filter(
      (s) => s.name.includes(q) || s.code.includes(q)
    ).slice(0, 8);

    if (local.length > 0) {
      setSuggestions(local);
    }

    // 6자리 코드 입력 시 Yahoo Finance에서 실시간 조회
    if (isKoreanCode(q)) {
      setIsSearching(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/stock/search?q=${q}`);
          const data = await res.json();
          if (data.results?.length > 0) {
            // 로컬에 없는 결과만 추가
            const localCodes = new Set(local.map((s) => s.code));
            const extra = data.results.filter(
              (r: Stock) => !localCodes.has(r.code)
            );
            setSuggestions([...local, ...extra].slice(0, 8));
          }
        } catch {
          // ignore
        } finally {
          setIsSearching(false);
        }
      }, 400);
    }
  }, [query]);

  const handleAdd = (stock: Stock) => {
    dispatch({
      type: "ADD",
      payload: {
        ...stock,
        yahooCode: toYahooCode(stock.code, stock.market),
        addedAt: new Date().toISOString(),
      },
    });
    setQuery("");
    setSuggestions([]);
  };

  const showDropdown = query.trim().length > 0 && (suggestions.length > 0 || isSearching);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setQuery(""); setSuggestions([]); }
          }}
          placeholder="종목명 또는 코드 검색 (예: 삼성전자, 005930)"
          className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white border border-gray-600 focus:border-blue-500 outline-none transition-colors pr-10"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-500 border-t-blue-400 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && (
        <ul className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded-xl mt-1 shadow-2xl overflow-hidden">
          {suggestions.length > 0 ? (
            suggestions.map((s) => (
              <li
                key={`${s.code}-${s.market}`}
                onClick={() => handleAdd(s)}
                className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex justify-between items-center transition-colors"
              >
                <span className="text-white font-medium">{s.name}</span>
                <span className="text-gray-400 text-sm">
                  {s.code} &middot;{" "}
                  <span className={s.market === "KOSPI" ? "text-blue-400" : "text-purple-400"}>
                    {s.market}
                  </span>
                </span>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-500 text-sm text-center">
              검색 중...
            </li>
          )}
          {isKoreanCode(query.trim()) && suggestions.length > 0 && (
            <li className="px-4 py-2 text-gray-600 text-xs border-t border-gray-700">
              6자리 코드로 검색하면 전체 종목 조회 가능
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
