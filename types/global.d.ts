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
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
      }) => string;
      remove: (widgetId?: string) => void;
    };
    webkitAudioContext: typeof AudioContext;
  }
}
