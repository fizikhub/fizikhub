export {};

declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: IdleDeadline) => void,
      options?: { timeout: number }
    ) => number;
    cancelIdleCallback: (handle: number) => void;
    onTurnstileSuccess?: (token: string) => void;
    onTurnstileExpired?: () => void;
    onTurnstileError?: () => void;
    turnstile?: {
      reset: (widgetId?: string) => void;
    };
    webkitAudioContext: typeof AudioContext;
  }
}
