import { contextBridge } from 'electron';

const desktopApi = {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node
  }
};

contextBridge.exposeInMainWorld('desktop', desktopApi);
