"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const desktopApi = {
    getRuntimeInfo: () => electron_1.ipcRenderer.invoke('app:get-runtime-info')
};
electron_1.contextBridge.exposeInMainWorld('desktop', desktopApi);
