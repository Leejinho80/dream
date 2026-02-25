"use client";

import type { TimingLevel } from "@/types";

interface TimingSignalProps {
  type: "buy" | "sell";
  level: TimingLevel;
  label: string;
}

const LEVELS: TimingLevel[] = ["great", "good", "bad", "terrible"];

const LEVEL_COLORS: Record<TimingLevel, { active: string; inactive: string }> = {
  great: { active: "bg-green-400 shadow-green-400/60", inactive: "bg-gray-600" },
  good: { active: "bg-yellow-400 shadow-yellow-400/60", inactive: "bg-gray-600" },
  bad: { active: "bg-orange-400 shadow-orange-400/60", inactive: "bg-gray-600" },
  terrible: { active: "bg-red-500 shadow-red-500/60", inactive: "bg-gray-600" },
};

const LEVEL_TEXT: Record<TimingLevel, string> = {
  great: "text-green-400",
  good: "text-yellow-400",
  bad: "text-orange-400",
  terrible: "text-red-400",
};

export default function TimingSignal({ type, level, label }: TimingSignalProps) {
  const typeLabel = type === "buy" ? "매수" : "매도";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-400">{typeLabel}</span>
      {/* 신호등 불빛 — great(녹), good(황), bad(주황), terrible(적) 순서로 세로 배열 */}
      <div className="flex flex-col items-center gap-1 bg-gray-900 rounded-lg px-2 py-2 border border-gray-700">
        {LEVELS.map((l) => {
          const isActive = l === level;
          const colors = LEVEL_COLORS[l];
          return (
            <div
              key={l}
              className={`w-4 h-4 rounded-full transition-all ${
                isActive
                  ? `${colors.active} shadow-md`
                  : colors.inactive
              }`}
            />
          );
        })}
      </div>
      <span className={`text-xs font-semibold ${LEVEL_TEXT[level]}`}>{label}</span>
    </div>
  );
}
