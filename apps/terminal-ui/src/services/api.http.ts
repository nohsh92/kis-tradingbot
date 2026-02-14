import type { Workspace } from "../state/workspaces.store";

export class WorkspaceApiClient {
  constructor(private readonly baseUrl = "") {}

  async listWorkspaces(): Promise<Workspace[]> {
    return this.request<Workspace[]>("/workspaces", { method: "GET" });
  }

  async getWorkspace(workspaceId: string): Promise<Workspace> {
    return this.request<Workspace>(`/workspaces/${workspaceId}`, { method: "GET" });
  }

  async upsertWorkspace(workspace: Workspace): Promise<void> {
    const method = workspace.id ? "PUT" : "POST";
    const path = workspace.id ? `/workspaces/${workspace.id}` : "/workspaces";

    await this.request(path, {
      method,
      body: JSON.stringify(workspace),
      headers: { "Content-Type": "application/json" },
    });
  }

  async deleteWorkspace(workspaceId: string): Promise<void> {
    await this.request(`/workspaces/${workspaceId}`, { method: "DELETE" });
  }

  private async request<T = void>(path: string, init: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, init);
    if (!response.ok) {
      throw new Error(`Workspace API error (${response.status}) for ${path}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }
}
