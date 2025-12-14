export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: number | null = null;

  return function debounced(this: any, ...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func.apply(this, args), delay);
  } as T;
}