import { defaultDockingModel, normalizeDockingLayout } from "../components/Docking/docking.model";
import { migrateWorkspaceSchema } from "../utils/workspace.migrations";
import { WORKSPACE_SCHEMA_VERSION } from "./workspace.schema";
import { WorkspaceApiClient } from "../services/api.http";
import { WorkspaceLocalStore } from "../services/workspace.local";

export type DockingLayout = Record<string, unknown>;

export interface Workspace {
  id: string;
  name: string;
  schemaVersion: number;
  layout: DockingLayout;
  openPanels: string[];
  updatedAt: string;
}

export interface WorkspaceState {
  activeWorkspace: Workspace;
  workspaces: Workspace[];
  hydratedFromLocal: boolean;
}

export function createDefaultWorkspace(): Workspace {
  return {
    id: "default",
    name: "Default Workspace",
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    layout: defaultDockingModel,
    openPanels: ["watchlist", "chart", "orders"],
    updatedAt: new Date().toISOString(),
  };
}

export class WorkspaceStore {
  private state: WorkspaceState = {
    activeWorkspace: createDefaultWorkspace(),
    workspaces: [],
    hydratedFromLocal: false,
  };

  constructor(
    private readonly localStore: WorkspaceLocalStore,
    private readonly apiClient: WorkspaceApiClient,
  ) {}

  getSnapshot(): WorkspaceState {
    return this.state;
  }

  async restoreWorkspace(workspaceId: string): Promise<Workspace> {
    const localWorkspace = await this.localStore.getWorkspace(workspaceId);
    const resolved = localWorkspace ?? (await this.apiClient.getWorkspace(workspaceId));
    const migrated = migrateWorkspaceSchema(resolved);

    this.state = {
      ...this.state,
      activeWorkspace: migrated,
      workspaces: upsertWorkspace(this.state.workspaces, migrated),
    };

    return migrated;
  }

  async saveWorkspace(partial: Partial<Pick<Workspace, "layout" | "openPanels">>): Promise<Workspace> {
    const next: Workspace = {
      ...this.state.activeWorkspace,
      ...partial,
      layout: normalizeDockingLayout(partial.layout ?? this.state.activeWorkspace.layout),
      schemaVersion: WORKSPACE_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
    };

    await this.localStore.saveWorkspace(next);
    await this.apiClient.upsertWorkspace(next, true);

    this.state = {
      ...this.state,
      activeWorkspace: next,
      workspaces: upsertWorkspace(this.state.workspaces, next),
    };

    return next;
  }

  async saveWorkspaceAs(name: string): Promise<Workspace> {
    const now = new Date().toISOString();
    const next: Workspace = {
      ...this.state.activeWorkspace,
      id: crypto.randomUUID(),
      name,
      schemaVersion: WORKSPACE_SCHEMA_VERSION,
      updatedAt: now,
    };

    await this.localStore.saveWorkspace(next);
    await this.apiClient.upsertWorkspace(next, false);

    this.state = {
      ...this.state,
      activeWorkspace: next,
      workspaces: upsertWorkspace(this.state.workspaces, next),
    };

    return next;
  }

  async resetWorkspace(): Promise<Workspace> {
    const reset = createDefaultWorkspace();
    await this.localStore.saveWorkspace(reset);

    this.state = {
      ...this.state,
      activeWorkspace: reset,
      workspaces: upsertWorkspace(this.state.workspaces, reset),
    };

    return reset;
  }

  async hydrateOnStart(): Promise<WorkspaceState> {
    const localWorkspaces = (await this.localStore.listWorkspaces()).map((w) => migrateWorkspaceSchema(w));
    const localActive = localWorkspaces[0] ?? createDefaultWorkspace();

    this.state = {
      activeWorkspace: localActive,
      workspaces: localWorkspaces,
      hydratedFromLocal: true,
    };

    const backendWorkspaceRefs = await this.apiClient.listWorkspaces();
    const backendWorkspaces = (
      await Promise.all(backendWorkspaceRefs.map((workspace) => this.apiClient.getWorkspace(workspace.id).catch(() => workspace)))
    ).map((workspace) => migrateWorkspaceSchema(workspace));

    for (const remote of backendWorkspaces) {
      const local = localWorkspaces.find((workspace) => workspace.id === remote.id);
      if (!local || new Date(remote.updatedAt) > new Date(local.updatedAt)) {
        await this.localStore.saveWorkspace(remote);
      }
    }

    const merged = dedupeById([...localWorkspaces, ...backendWorkspaces]).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    this.state = {
      ...this.state,
      workspaces: merged,
      activeWorkspace: merged.find((w) => w.id === this.state.activeWorkspace.id) ?? merged[0] ?? createDefaultWorkspace(),
    };

    return this.state;
  }
}

function upsertWorkspace(items: Workspace[], next: Workspace): Workspace[] {
  const existing = items.find((item) => item.id === next.id);
  if (!existing) {
    return [next, ...items];
  }

  return items.map((item) => (item.id === next.id ? next : item));
}

function dedupeById(items: Workspace[]): Workspace[] {
  const map = new Map<string, Workspace>();
  for (const item of items) {
    const existing = map.get(item.id);
    if (!existing || new Date(item.updatedAt) > new Date(existing.updatedAt)) {
      map.set(item.id, item);
    }
  }

  return [...map.values()];
}
