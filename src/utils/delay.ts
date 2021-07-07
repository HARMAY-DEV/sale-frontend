export function delay(duration: number): Promise<number> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(timer);
    }, duration);
  });
}