import { contextBridge, ipcRenderer } from 'electron';

type RuntimeInfo = {
  platform: string;
  versions: {
    electron: string;
    chrome: string;
    node: string;
  };
};

const desktopApi = {
  getRuntimeInfo: (): Promise<RuntimeInfo> => ipcRenderer.invoke('app:get-runtime-info')
};

contextBridge.exposeInMainWorld('desktop', desktopApi);
