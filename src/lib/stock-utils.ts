export function toYahooCode(code: string, market: "KOSPI" | "KOSDAQ"): string {
  const suffix = market === "KOSPI" ? ".KS" : ".KQ";
  return `${code}${suffix}`;
}
