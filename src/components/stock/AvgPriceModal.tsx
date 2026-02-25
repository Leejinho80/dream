"use client";

import { useState, useEffect } from "react";
import type { WatchlistItem } from "@/types";
import { calcProfitRate } from "@/lib/timing";

interface AvgPriceModalProps {
  item: WatchlistItem;
  currentPrice: number;
  onClose: () => void;
  onSave: (price: number | undefined) => void;
}

export default function AvgPriceModal({
  item,
  currentPrice,
  onClose,
  onSave,
}: AvgPriceModalProps) {
  const [inputValue, setInputValue] = useState(
    item.avgPrice ? String(item.avgPrice) : ""
  );

  const parsedPrice = Number(inputValue.replace(/,/g, ""));
  const isValid = !isNaN(parsedPrice) && parsedPrice > 0;
  const profitRate = isValid ? calcProfitRate(currentPrice, parsedPrice) : null;

  // ESC로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = () => {
    if (isValid) {
      onSave(parsedPrice);
    }
    onClose();
  };

  const handleDelete = () => {
    onSave(undefined);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-white text-lg font-bold">{item.name}</h2>
            <p className="text-gray-400 text-sm">{item.code} · {item.market}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="mb-2">
          <label className="block text-sm text-gray-400 mb-1">평단가 (원)</label>
          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            placeholder="예: 75000"
            autoFocus
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white text-lg outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* 현재가 표시 */}
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-400">현재가</span>
          <span className="text-white font-medium">
            {currentPrice.toLocaleString()}원
          </span>
        </div>

        {/* 수익률 미리보기 */}
        {profitRate !== null && (
          <div className="bg-gray-700/50 rounded-xl p-3 mb-5 text-center">
            <span className="text-xs text-gray-400">예상 수익률</span>
            <div
              className={`text-2xl font-bold mt-1 ${
                profitRate >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {profitRate >= 0 ? "+" : ""}
              {profitRate.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {profitRate >= 0
                ? `${(currentPrice - parsedPrice).toLocaleString()}원 수익`
                : `${(parsedPrice - currentPrice).toLocaleString()}원 손실`}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {item.avgPrice && (
            <button
              onClick={handleDelete}
              className="flex-1 py-3 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
            >
              삭제
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium transition-colors text-sm"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
