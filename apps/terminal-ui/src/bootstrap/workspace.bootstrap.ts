import { WorkspaceApiClient } from "../services/api.http";
import { IndexedDbWorkspaceStore } from "../services/workspace.local";
import { WorkspaceStore } from "../state/workspaces.store";

export async function bootstrapWorkspaceStore(): Promise<WorkspaceStore> {
  const localStore = new IndexedDbWorkspaceStore();
  const apiClient = new WorkspaceApiClient("/api/v1");

  const store = new WorkspaceStore(localStore, apiClient);

  // Fast paint from local cache first, then server reconciliation.
  await store.hydrateOnStart();

  return store;
}
