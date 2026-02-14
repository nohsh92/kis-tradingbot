/// <reference types="vite/client" />

type RuntimeInfo = {
  platform: string;
  versions: {
    electron: string;
    chrome: string;
    node: string;
  };
};

declare global {
  interface Window {
    desktop?: {
      getRuntimeInfo: () => Promise<RuntimeInfo>;
    };
  }
}

export {};
