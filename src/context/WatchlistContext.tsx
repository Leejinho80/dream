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

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  dispatch: React.Dispatch<Action>;
}

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  dispatch: () => {},
});

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      try {
        dispatch({ type: "LOAD", payload: JSON.parse(saved) });
      } catch {
        // ignore parse errors
      }
    }
  }, []);

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
