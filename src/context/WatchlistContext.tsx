"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import type { WatchlistItem } from "@/types";

type Action =
  | { type: "ADD"; payload: WatchlistItem }
  | { type: "REMOVE"; payload: string }
  | { type: "LOAD"; payload: WatchlistItem[] }
  | { type: "SET_AVG_PRICE"; code: string; price: number | undefined };

function reducer(state: WatchlistItem[], action: Action): WatchlistItem[] {
  switch (action.type) {
    case "ADD":
      if (state.find((s) => s.code === action.payload.code)) return state;
      return [...state, action.payload];
    case "REMOVE":
      return state.filter((s) => s.code !== action.payload);
    case "LOAD":
      return action.payload;
    case "SET_AVG_PRICE":
      return state.map((s) =>
        s.code === action.code ? { ...s, avgPrice: action.price } : s
      );
    default:
      return state;
  }
}

// useReducer 초기화 함수 — 최초 렌더 전에 localStorage에서 동기적으로 읽어옴
// save effect와의 경쟁 조건 없이 안전하게 초기 상태를 복원
function loadFromStorage(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("watchlist");
    return saved ? (JSON.parse(saved) as WatchlistItem[]) : [];
  } catch {
    return [];
  }
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  dispatch: React.Dispatch<Action>;
}

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  dispatch: () => {},
});

export function WatchlistProvider({ children }: { children: ReactNode }) {
  // 두 번째 인자(null)는 init 함수에 전달되는 initialArg
  // loadFromStorage가 초기 상태를 결정 → effect 없이 즉시 복원
  const [watchlist, dispatch] = useReducer(reducer, null, loadFromStorage);

  // 상태가 바뀔 때마다 저장 (초기 로드 포함)
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return (
    <WatchlistContext.Provider value={{ watchlist, dispatch }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
