import { defaultDockingModel } from "../components/Docking/docking.model";
import type { Workspace } from "../state/workspaces.store";
import { WORKSPACE_SCHEMA_VERSION } from "../state/workspace.schema";

type WorkspaceMigration = (workspace: Workspace) => Workspace;

const migrations: Record<number, WorkspaceMigration> = {
  0: (workspace) => ({
    ...workspace,
    schemaVersion: 1,
    openPanels: workspace.openPanels?.length ? workspace.openPanels : ["watchlist", "chart", "orders"],
    layout: workspace.layout ?? defaultDockingModel,
  }),
};

export function migrateWorkspaceSchema(workspace: Workspace): Workspace {
  let next = { ...workspace };

  while (next.schemaVersion < WORKSPACE_SCHEMA_VERSION) {
    const migration = migrations[next.schemaVersion];
    if (!migration) {
      break;
    }

    next = migration(next);
  }

  if (next.schemaVersion !== WORKSPACE_SCHEMA_VERSION) {
    next.schemaVersion = WORKSPACE_SCHEMA_VERSION;
  }

  return next;
}
