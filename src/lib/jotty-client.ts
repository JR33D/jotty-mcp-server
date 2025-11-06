import type { Config } from '../config.js';

export type ChecklistItem = {
  text: string;
  status: 'todo' | 'done' | 'in_progress' | 'paused';
  time?: number;
}

export type Checklist = {
  id: string;
  title: string;
  items: Array<ChecklistItem>;
  createdAt: string;
  updatedAt: string;
}

export type JottyNote = {
  id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export type Category = {
  id: string;
  name: string;
  path: string;
}

export type UserInfo = {
  username: string;
  email: string;
  createdAt: string;
}

export type SummaryStats = {
  totalChecklists: number;
  totalNotes: number;
  totalItems: number;
  completedItems: number;
}

export type ExportStatus = {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export class JottyClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(config: Config) {
    this.baseUrl = config.JOTTY_BASE_URL;
    this.apiKey = config.JOTTY_API_KEY;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: object
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };

    console.log(`[JottyClient] Making ${method} request to ${url}`);
    if (body != null) {
      console.log(`[JottyClient] Request body: ${JSON.stringify(body)}`);
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: (body != null) ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[JottyClient] API Error: ${response.status.toString()} ${response.statusText} - ${errorText}`);
        throw new Error(`Jotty API request failed: ${response.status.toString()} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`[JottyClient] Response from ${url}: ${JSON.stringify(data)}`);
      return data as T;
    } catch (error) {
      console.error(`[JottyClient] Request to ${url} failed:`, error);
      throw error;
    }
  }

  async getAllChecklists(): Promise<Array<Checklist>> {
    return this.makeRequest<Array<Checklist>>('/api/checklists');
  }

  async addChecklistItem(
    id: string,
    item: { text: string; status?: 'todo' | 'done' | 'in_progress' | 'paused'; time?: number }
  ): Promise<ChecklistItem> {
    return this.makeRequest<ChecklistItem>(`/api/checklists/${id}/items`, 'POST', item);
  }

  async checkItem(id: string, index: number): Promise<ChecklistItem> {
    return this.makeRequest<ChecklistItem>(`/api/checklists/${id}/items/${index.toString()}/check`, 'PUT');
  }

  async uncheckItem(id: string, index: number): Promise<ChecklistItem> {
    return this.makeRequest<ChecklistItem>(`/api/checklists/${id}/items/${index.toString()}/uncheck`, 'PUT');
  }

  async getAllNotes(): Promise<Array<JottyNote>> {
    return this.makeRequest<Array<JottyNote>>('/api/notes');
  }

  async createNote(note: { title: string; content: string; category?: string }): Promise<JottyNote> {
    return this.makeRequest<JottyNote>('/api/notes', 'POST', note);
  }

  async getCategories(): Promise<Array<Category>> {
    return this.makeRequest<Array<Category>>('/api/categories');
  }

  async getSummary(): Promise<SummaryStats> {
    return this.makeRequest<SummaryStats>('/api/summary');
  }

  async getUserInfo(username: string): Promise<UserInfo> {
    return this.makeRequest<UserInfo>(`/api/user/${username}`);
  }

  async exportData(type: 'json' | 'csv', username?: string): Promise<{ exportId: string }> {
    return this.makeRequest<{ exportId: string }>('/api/exports', 'POST', { type, username });
  }

  async getExportProgress(exportId: string): Promise<ExportStatus> {
    return this.makeRequest<ExportStatus>(`/api/exports/${exportId}`);
  }
}

export function createJottyClient(config: Config): JottyClient {
  return new JottyClient(config);
}

let defaultClient: JottyClient | undefined;

export async function getJottyClient(): Promise<JottyClient> {
  if (defaultClient === undefined) {
    const { getConfig } = await import('../config.js');
    defaultClient = createJottyClient(getConfig());
  }
  return defaultClient;
}

export function resetJottyClient(): void {
  defaultClient = undefined;
}