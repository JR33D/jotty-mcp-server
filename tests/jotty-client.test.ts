import assert from 'node:assert';
import { test } from 'node:test';
import sinon from 'sinon';
import { JottyClient } from '../src/lib/jotty-client.js';

const mockChecklistsResponse = (): Promise<Response> => Promise.resolve(new Response(JSON.stringify([{ id: '1', title: 'Test Checklist', items: [] }]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
const mockAddChecklistItemResponse = (): Promise<Response> => Promise.resolve(new Response(JSON.stringify({ text: 'New Item', status: 'todo' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
const mockCheckItemResponse = (): Promise<Response> => Promise.resolve(new Response(JSON.stringify({ text: 'Checked Item', status: 'done' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
const mockUncheckItemResponse = (): Promise<Response> => Promise.resolve(new Response(JSON.stringify({ text: 'Unchecked Item', status: 'todo' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
const mockNotesResponse = (): Promise<Response> => Promise.resolve(new Response(JSON.stringify([{ id: '1', title: 'Test Note', content: 'Note Content' }]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
const mockCreateNoteResponse = (): Promise<Response> => Promise.resolve(new Response(JSON.stringify({ id: '2', title: 'New Note', content: 'New Content' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
const mockCategoriesResponse = (): Promise<Response> => Promise.resolve(new Response(JSON.stringify([{ id: '1', name: 'Category 1', path: 'Category 1' }]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
const mockSummaryResponse = (): Promise<Response> => Promise.resolve(new Response(JSON.stringify({ totalChecklists: 1, totalNotes: 1, totalItems: 1, completedItems: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
const mockUserInfoResponse = (): Promise<Response> => Promise.resolve(new Response(JSON.stringify({ username: 'testuser', email: 'test@example.com' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
const mockExportDataResponse = (): Promise<Response> => Promise.resolve(new Response(JSON.stringify({ exportId: 'exp_123' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
const mockExportProgressResponse = (): Promise<Response> => Promise.resolve(new Response(JSON.stringify({ id: 'exp_123', status: 'completed', progress: 100 }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
const mockNotFoundResponse = (): Promise<Response> => Promise.resolve(new Response(JSON.stringify({ message: 'Not Found' }), { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'application/json' } }));

let sandbox: sinon.SinonSandbox;
let _fetchStub: sinon.SinonStub;

function checkChecklistsEndpointsCalled(url: string | URL | Request, options?: RequestInit) : Promise<Response> | undefined {
  const urlString = typeof url === 'string' ? url : (url instanceof URL ? url.toString() : (url).url);
  if (urlString.endsWith('/api/checklists') && options?.method === 'GET') {
    return mockChecklistsResponse();
  }
  if (urlString.includes('/api/checklists/') && urlString.endsWith('/items') && options?.method === 'POST') {
    return mockAddChecklistItemResponse();
  }
  if (urlString.includes('/api/checklists/') && urlString.endsWith('/check') && options?.method === 'PUT') {
    return mockCheckItemResponse();
  }
  if (urlString.includes('/api/checklists/') && urlString.endsWith('/uncheck') && options?.method === 'PUT') {
    return mockUncheckItemResponse();
  }
  return undefined;
}

function checkNotesEndpointsCalled(url: string | URL | Request, options?: RequestInit) : Promise<Response> | undefined {
  const urlString = typeof url === 'string' ? url : (url instanceof URL ? url.toString() : (url).url);
  if (urlString.endsWith('/api/notes') && options?.method === 'GET') {
    return mockNotesResponse();
  }
  if (urlString.endsWith('/api/notes') && options?.method === 'POST') {
    return mockCreateNoteResponse();
  }
  return undefined;
}

function checkCategoriesEndpointsCalled(url: string | URL | Request, options?: RequestInit) : Promise<Response> | undefined {
  const urlString = typeof url === 'string' ? url : (url instanceof URL ? url.toString() : (url).url);
  if (urlString.endsWith('/api/categories') && options?.method === 'GET') {
    return mockCategoriesResponse();
  }
  return undefined;
}

function checkSummaryEndpointsCalled(url: string | URL | Request, options?: RequestInit) : Promise<Response> | undefined {
  const urlString = typeof url === 'string' ? url : (url instanceof URL ? url.toString() : (url).url);
  if (urlString.endsWith('/api/summary') && options?.method === 'GET') {
    return mockSummaryResponse();
  }
  return undefined;
}

function checkUserEndpointsCalled(url: string | URL | Request, options?: RequestInit) : Promise<Response> | undefined {
  const urlString = typeof url === 'string' ? url : (url instanceof URL ? url.toString() : (url).url);
    if (urlString.includes('/api/user/') && options?.method === 'GET') {
      return mockUserInfoResponse();
    }
  return undefined;
}

function checkExportsEndpointsCalled(url: string | URL | Request, options?: RequestInit) : Promise<Response> | undefined {
  const urlString = typeof url === 'string' ? url : (url instanceof URL ? url.toString() : (url).url);
  if (urlString.endsWith('/api/exports') && options?.method === 'POST') {
    return mockExportDataResponse();
  }
  if (urlString.includes('/api/exports/') && (/\/api\/exports\/[^/]+$/.exec(urlString) != null) && options?.method === 'GET') {
    return mockExportProgressResponse();
  }
  return undefined;
}

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
  sandbox.stub(process.env, 'JOTTY_BASE_URL').value('http://localhost:1122');
  sandbox.stub(process.env, 'JOTTY_API_KEY').value('ck_xxxxx');
  _fetchStub = sandbox.stub(global, 'fetch').callsFake((url: string | URL | Request, options?: RequestInit) => {
    let response: Promise<Response> | undefined;
    response = checkChecklistsEndpointsCalled(url, options);
    response = response ?? checkNotesEndpointsCalled(url, options);
    response = response ?? checkCategoriesEndpointsCalled(url, options);
    response = response ?? checkSummaryEndpointsCalled(url, options);
    response = response ?? checkUserEndpointsCalled(url, options);
    response = response ?? checkExportsEndpointsCalled(url, options);

    return response ?? mockNotFoundResponse();
  });
});

test.afterEach(() => {
  sandbox.restore();
});

const client = new JottyClient();

test('JottyClient - getAllChecklists', async () => {
  const checklists = await client.getAllChecklists();
  assert.ok(checklists.length > 0, 'Checklists array should not be empty');
  assert.strictEqual(checklists[0]?.title, 'Test Checklist');
});

test('JottyClient - addChecklistItem', async () => {
  const item = await client.addChecklistItem('1', { text: 'New Item' });
  assert.strictEqual(item.text, 'New Item');
});

test('JottyClient - checkItem', async () => {
  const item = await client.checkItem('1', 0);
  assert.strictEqual(item.status, 'done');
});

test('JottyClient - uncheckItem', async () => {
  const item = await client.uncheckItem('1', 0);
  assert.strictEqual(item.status, 'todo');
});

test('JottyClient - getAllNotes', async () => {
  const notes = await client.getAllNotes();
  assert.ok(notes.length > 0, 'Notes array should not be empty');
  assert.strictEqual(notes[0]?.title, 'Test Note');
});

test('JottyClient - createNote', async () => {
  const note = await client.createNote({ title: 'New Note', content: 'New Content' });
  assert.strictEqual(note.title, 'New Note');
});

test('JottyClient - getCategories', async () => {
  const categories = await client.getCategories();
  assert.ok(categories.length > 0, 'Categories array should not be empty');
  assert.strictEqual(categories[0]?.name, 'Category 1');
});

test('JottyClient - getSummary', async () => {
  const summary = await client.getSummary();
  assert.strictEqual(summary.totalChecklists, 1);
});

test('JottyClient - getUserInfo', async () => {
  const userInfo = await client.getUserInfo('testuser');
  assert.strictEqual(userInfo.username, 'testuser');
});

test('JottyClient - exportData', async () => {
  const exportResult = await client.exportData('json');
  assert.strictEqual(exportResult.exportId, 'exp_123');
});

test('JottyClient - getExportProgress', async () => {
  const exportStatus = await client.getExportProgress('exp_123');
  assert.strictEqual(exportStatus.status, 'completed');
});
