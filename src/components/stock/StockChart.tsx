"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { StockHistory } from "@/types";

interface Props {
  data: StockHistory[];
  color?: string;
  avgPrice?: number;
}

export default function StockChart({ data, color = "#ef4444", avgPrice }: Props) {
  const formatPrice = (v: number) => v.toLocaleString("ko-KR");

  const formatDate = (date: string) => {
    const parts = date.split("-");
    return `${parts[1]}/${parts[2]}`;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        차트 데이터가 없습니다.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={formatPrice}
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          domain={["auto", "auto"]}
          width={80}
        />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [formatPrice(Number(value)) + "원", "종가"]}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          labelFormatter={(label: any) => formatDate(String(label))}
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#f9fafb",
          }}
        />
        <Line
          type="monotone"
          dataKey="close"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, fill: color }}
        />
        {avgPrice && avgPrice > 0 && (
          <ReferenceLine
            y={avgPrice}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `평단가 ${avgPrice.toLocaleString()}`,
              position: "insideTopRight",
              fill: "#f59e0b",
              fontSize: 11,
            }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
