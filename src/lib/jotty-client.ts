import { env } from '../config.js';

// --- Type Definitions for Jotty API Responses ---

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

// --- JottyClient Class ---

export class JottyClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = env.JOTTY_BASE_URL;
    this.apiKey = env.JOTTY_API_KEY;
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

  // 1. GET /api/checklists - Get all checklists
  async getAllChecklists(): Promise<Array<Checklist>> {
    return this.makeRequest<Array<Checklist>>('/api/checklists');
  }

  // 2. POST /api/checklists/{id}/items - Add item to checklist
  async addChecklistItem(
    id: string,
    item: { text: string; status?: 'todo' | 'done' | 'in_progress' | 'paused'; time?: number }
  ): Promise<ChecklistItem> {
    return this.makeRequest<ChecklistItem>(`/api/checklists/${id}/items`, 'POST', item);
  }

  // 3. PUT /api/checklists/{id}/items/{index}/check - Mark item complete
  async checkItem(id: string, index: number): Promise<ChecklistItem> {
    return this.makeRequest<ChecklistItem>(`/api/checklists/${id}/items/${index.toString()}/check`, 'PUT');
  }

  // 4. PUT /api/checklists/{id}/items/{index}/uncheck - Mark item incomplete
  async uncheckItem(id: string, index: number): Promise<ChecklistItem> {
    return this.makeRequest<ChecklistItem>(`/api/checklists/${id}/items/${index.toString()}/uncheck`, 'PUT');
  }

  // 5. GET /api/notes - Get all notes
  async getAllNotes(): Promise<Array<JottyNote>> {
    return this.makeRequest<Array<JottyNote>>('/api/notes');
  }

  // 6. POST /api/notes - Create note
  async createNote(note: { title: string; content: string; category?: string }): Promise<JottyNote> {
    return this.makeRequest<JottyNote>('/api/notes', 'POST', note);
  }

  // 7. GET /api/categories - Get categories
  async getCategories(): Promise<Array<Category>> {
    return this.makeRequest<Array<Category>>('/api/categories');
  }

  // 8. GET /api/summary - Get statistics
  async getSummary(): Promise<SummaryStats> {
    return this.makeRequest<SummaryStats>('/api/summary');
  }

  // 9. GET /api/user/{username} - Get user info
  async getUserInfo(username: string): Promise<UserInfo> {
    return this.makeRequest<UserInfo>(`/api/user/${username}`);
  }

  // 10. POST /api/exports - Export data
  async exportData(type: 'json' | 'csv', username?: string): Promise<{ exportId: string }> {
    return this.makeRequest<{ exportId: string }>('/api/exports', 'POST', { type, username });
  }

  // 11. GET /api/exports - Get export progress
  async getExportProgress(exportId: string): Promise<ExportStatus> {
    return this.makeRequest<ExportStatus>(`/api/exports/${exportId}`);
  }
}

export const jottyClient = new JottyClient();
