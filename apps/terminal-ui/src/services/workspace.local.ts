import type { Workspace } from "../state/workspaces.store";

export interface WorkspaceLocalStore {
  listWorkspaces(): Promise<Workspace[]>;
  getWorkspace(workspaceId: string): Promise<Workspace | null>;
  saveWorkspace(workspace: Workspace): Promise<void>;
  deleteWorkspace(workspaceId: string): Promise<void>;
}

type ElectronBridge = {
  workspaceStore?: {
    list: () => Promise<Workspace[]>;
    get: (workspaceId: string) => Promise<Workspace | null>;
    save: (workspace: Workspace) => Promise<void>;
    delete: (workspaceId: string) => Promise<void>;
  };
};

const DB_NAME = "kis-tradingbot";
const STORE_NAME = "workspaces";
const KEY_PATH = "id";

export class IndexedDbWorkspaceStore implements WorkspaceLocalStore {
  async listWorkspaces(): Promise<Workspace[]> {
    if (hasElectronBridge()) {
      return window.electron.workspaceStore!.list();
    }

    const db = await openWorkspaceDb();
    const records = await runTx<Workspace[]>(db, "readonly", (store, resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as Workspace[]);
    });

    return records.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    if (hasElectronBridge()) {
      return window.electron.workspaceStore!.get(workspaceId);
    }

    const db = await openWorkspaceDb();
    return runTx<Workspace | null>(db, "readonly", (store, resolve) => {
      const request = store.get(workspaceId);
      request.onsuccess = () => resolve((request.result as Workspace | undefined) ?? null);
    });
  }

  async saveWorkspace(workspace: Workspace): Promise<void> {
    if (hasElectronBridge()) {
      await window.electron.workspaceStore!.save(workspace);
      return;
    }

    const db = await openWorkspaceDb();
    await runTx<void>(db, "readwrite", (store, resolve) => {
      const request = store.put(workspace);
      request.onsuccess = () => resolve();
    });
  }

  async deleteWorkspace(workspaceId: string): Promise<void> {
    if (hasElectronBridge()) {
      await window.electron.workspaceStore!.delete(workspaceId);
      return;
    }

    const db = await openWorkspaceDb();
    await runTx<void>(db, "readwrite", (store, resolve) => {
      const request = store.delete(workspaceId);
      request.onsuccess = () => resolve();
    });
  }
}

function hasElectronBridge(): boolean {
  return typeof window !== "undefined" && Boolean(window.electron?.workspaceStore);
}

function openWorkspaceDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: KEY_PATH });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runTx<T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  runner: (store: IDBObjectStore, resolve: (value: T) => void, reject: (error: unknown) => void) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    runner(store, resolve, reject);
    tx.onerror = () => reject(tx.error);
  });
}

declare global {
  interface Window {
    electron: ElectronBridge;
  }
}
