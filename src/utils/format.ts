/**
 * 小工具集：日期 / 数字 / 文本。
 * 全站统一从这里取，避免各页面各写一套、时区还各不相同。
 */

/** 本地时区的 YYYY-MM-DD（不要用 toISOString，那会按 UTC 算，东八区早上八点前会串一天） */
export function localDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 安全取数：把可能是字符串 / NaN 的值收敛成数字 */
export function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** 秒 → mm:ss；unknown 时给出占位符 */
export function formatDuration(seconds: number, unknown = "--:--"): string {
  if (!Number.isFinite(seconds) || seconds < 0) return unknown;
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${`${s}`.padStart(2, "0")}`;
}

/** 中文字符按 2 个宽度计的字符数，用于「还剩 N 字」 */
export function textLength(value: string): number {
  return [...value].length;
}

/** 把可能为空的接口数组收敛成数组 */
export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
