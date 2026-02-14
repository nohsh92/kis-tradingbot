import type { Workspace } from '../state/workspaces.store';

export interface SymbolSearchResult {
  symbol: string;
  name: string;
  market: string;
  halted: boolean;
}

export class WorkspaceApiClient {
  constructor(private readonly baseUrl = '') {}

  async listWorkspaces(): Promise<Workspace[]> {
    return this.request<Workspace[]>('/workspaces', { method: 'GET' });
  }

  async getWorkspace(workspaceId: string): Promise<Workspace> {
    return this.request<Workspace>(`/workspaces/${workspaceId}`, { method: 'GET' });
  }

  async createWorkspace(workspace: Workspace): Promise<void> {
    await this.request('/workspaces', {
      method: 'POST',
      body: JSON.stringify(workspace),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async updateWorkspace(workspace: Workspace): Promise<void> {
    await this.request(`/workspaces/${workspace.id}`, {
      method: 'PUT',
      body: JSON.stringify(workspace),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async upsertWorkspace(workspace: Workspace, exists = true): Promise<void> {
    if (exists) {
      await this.updateWorkspace(workspace);
      return;
    }

    await this.createWorkspace(workspace);
  }

  async deleteWorkspace(workspaceId: string): Promise<void> {
    await this.request(`/workspaces/${workspaceId}`, { method: 'DELETE' });
  }

  async searchSymbols(query: string): Promise<SymbolSearchResult[]> {
    const safeQuery = encodeURIComponent(query);
    return this.request<SymbolSearchResult[]>(`/symbols/search?q=${safeQuery}`, { method: 'GET' });
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
