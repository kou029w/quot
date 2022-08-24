function throttle<Fn extends (...args: any[]) => any>(
  fn: Fn,
  ms: number
): (...args: Parameters<Fn>) => void {
  let throttledFn = () => undefined;
  let throttled: boolean = false;

  return (...args: Parameters<Fn>): void => {
    throttledFn = () => fn(...args);
    if (throttled) return;

    setTimeout(() => {
      throttledFn();
      throttled = false;
    }, ms);

    throttled = true;
  };
}

export default throttle;
