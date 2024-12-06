/* eslint-disable @typescript-eslint/no-explicit-any */
export function throttleAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {},
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: number | null = null;
  let previous = 0;
  let pending: Promise<ReturnType<T>> | null = null;

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const now = Date.now();

    if (!previous && options.leading === false) {
      previous = now;
    }

    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      pending = func(...args);
      return pending;
    }

    if (!timeout && options.trailing !== false) {
      return new Promise((resolve) => {
        timeout = window.setTimeout(async () => {
          previous = options.leading === false ? 0 : Date.now();
          timeout = null;
          pending = func(...args);
          resolve(pending);
        }, remaining);
      });
    }

    return pending!;
  };
}
