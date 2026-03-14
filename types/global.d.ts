export {};

declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: IdleDeadline) => void,
      options?: { timeout: number }
    ) => number;
    cancelIdleCallback: (handle: number) => void;
    onTurnstileSuccess?: (token: string) => void;
    webkitAudioContext: typeof AudioContext;
  }
}
