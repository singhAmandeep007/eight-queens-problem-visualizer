export type ControllableDelayResult = [timerId: number, promise: Promise<void>];

/**
 * Creates a delay that can be cancelled externally using the returned `timerId`.
 *
 * Usage:
 *   const [timerId, p] = controllableDelay(500);
 *   clearTimeout(timerId); // cancels
 *   await p; // resolves after 500ms unless cancelled
 */
export function controllableDelay(ms: number): ControllableDelayResult {
  let timerId: number;

  const promise = new Promise<void>((resolve) => {
    timerId = window.setTimeout(() => resolve(), ms);
  });

  // `timerId` is always assigned synchronously by the Promise constructor callback.
  return [timerId!, promise];
}

/**
 * Basic async delay.
 *
 * Usage:
 *   await delay(500);
 */
export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), ms);
  });
}
