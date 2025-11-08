import assert from 'node:assert';
import { describe, it, before, after } from 'node:test';
import sinon from 'sinon';
import { createTestConfig } from './helpers/test-config.js';
import { createJottyClient } from '../src/lib/jotty-client.js';

describe('JottyClient Unit Tests', () => {
  const mockChecklistsResponse = () => Promise.resolve(new Response(JSON.stringify([{ id: '1', title: 'Test Checklist', items: [] }]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  const mockAddChecklistItemResponse = () => Promise.resolve(new Response(JSON.stringify({ text: 'New Item', status: 'todo' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  const mockCheckItemResponse = () => Promise.resolve(new Response(JSON.stringify({ text: 'Checked Item', status: 'done' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  const mockUncheckItemResponse = () => Promise.resolve(new Response(JSON.stringify({ text: 'Unchecked Item', status: 'todo' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  const mockNotesResponse = () => Promise.resolve(new Response(JSON.stringify([{ id: '1', title: 'Test Note', content: 'Note Content' }]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  const mockCreateNoteResponse = () => Promise.resolve(new Response(JSON.stringify({ id: '2', title: 'New Note', content: 'New Content' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  const mockCategoriesResponse = () => Promise.resolve(new Response(JSON.stringify([{ id: '1', name: 'Category 1', path: 'Category 1' }]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  const mockSummaryResponse = () => Promise.resolve(new Response(JSON.stringify({ totalChecklists: 1, totalNotes: 1, totalItems: 1, completedItems: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  const mockUserInfoResponse = () => Promise.resolve(new Response(JSON.stringify({ username: 'testuser', email: 'test@example.com' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  const mockExportDataResponse = () => Promise.resolve(new Response(JSON.stringify({ exportId: 'exp_123' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  const mockExportProgressResponse = () => Promise.resolve(new Response(JSON.stringify({ id: 'exp_123', status: 'completed', progress: 100 }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  const mockNotFoundResponse = () => Promise.resolve(new Response(JSON.stringify({ message: 'Not Found' }), { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'application/json' } }));

  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;

  const config = createTestConfig();
  const client = createJottyClient(config);

  before(() => {
    sandbox = sinon.createSandbox();
    fetchStub = sandbox.stub(global, 'fetch');
  });

  after(() => {
    sandbox.restore();
  });

  it('JottyClient - getAllChecklists', async () => {
    fetchStub.returns(mockChecklistsResponse());
    const checklists = await client.getAllChecklists();
    assert.ok(checklists.length > 0, 'Checklists array should not be empty');
    assert.strictEqual(checklists[0]?.title, 'Test Checklist');
  });

  it('JottyClient - addChecklistItem', async () => {
    fetchStub.returns(mockAddChecklistItemResponse());
    const item = await client.addChecklistItem('1', { text: 'New Item' });
    assert.strictEqual(item.text, 'New Item');
  });

  it('JottyClient - checkItem', async () => {
    fetchStub.returns(mockCheckItemResponse());
    const item = await client.checkItem('1', 0);
    assert.strictEqual(item.status, 'done');
  });

  it('JottyClient - uncheckItem', async () => {
    fetchStub.returns(mockUncheckItemResponse());
    const item = await client.uncheckItem('1', 0);
    assert.strictEqual(item.status, 'todo');
  });

  it('JottyClient - getAllNotes', async () => {
    fetchStub.returns(mockNotesResponse());
    const notes = await client.getAllNotes();
    assert.ok(notes.length > 0, 'Notes array should not be empty');
    assert.strictEqual(notes[0]?.title, 'Test Note');
  });

  it('JottyClient - createNote', async () => {
    fetchStub.returns(mockCreateNoteResponse());
    const note = await client.createNote({ title: 'New Note', content: 'New Content' });
    assert.strictEqual(note.title, 'New Note');
  });

  it('JottyClient - getCategories', async () => {
    fetchStub.returns(mockCategoriesResponse());
    const categories = await client.getCategories();
    assert.ok(categories.length > 0, 'Categories array should not be empty');
    assert.strictEqual(categories[0]?.name, 'Category 1');
  });

  it('JottyClient - getSummary', async () => {
    fetchStub.returns(mockSummaryResponse());
    const summary = await client.getSummary();
    assert.strictEqual(summary.totalChecklists, 1);
  });

  it('JottyClient - getUserInfo', async () => {
    fetchStub.returns(mockUserInfoResponse());
    const userInfo = await client.getUserInfo('testuser');
    assert.strictEqual(userInfo.username, 'testuser');
  });

  it('JottyClient - exportData', async () => {
    fetchStub.returns(mockExportDataResponse());
    const exportResult = await client.exportData('json');
    assert.strictEqual(exportResult.exportId, 'exp_123');
  });

  it('JottyClient - getExportProgress', async () => {
    fetchStub.returns(mockExportProgressResponse());
    const exportStatus = await client.getExportProgress('exp_123');
    assert.strictEqual(exportStatus.status, 'completed');
  });

  it('JottyClient - should throw on API error', async () => {
    fetchStub.returns(mockNotFoundResponse());
    await assert.rejects(client.getAllChecklists(), /Jotty API request failed: 404 Not Found/);
  });
});