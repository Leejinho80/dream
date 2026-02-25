interface BadgeProps {
  value: number;
  label: string;
}

export default function Badge({ value, label }: BadgeProps) {
  const isPositive = value >= 0;
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-sm font-semibold ${
        isPositive
          ? "bg-red-900/40 text-red-400"
          : "bg-blue-900/40 text-blue-400"
      }`}
    >
      {isPositive ? "▲" : "▼"} {label}
    </span>
  );
}
