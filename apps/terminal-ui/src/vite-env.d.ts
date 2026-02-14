/// <reference types="vite/client" />

declare global {
  interface Window {
    desktop?: {
      platform: string;
      versions: {
        electron: string;
        chrome: string;
        node: string;
      };
    };
  }
}

export {};
