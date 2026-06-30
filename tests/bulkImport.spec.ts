import request from 'supertest';
import jwt from 'jsonwebtoken';
import { afterEach, beforeAll, beforeEach, describe, expect, it, jest, xit, } from '@jest/globals';

const readFileMock: any = jest.fn();
const fsMock = { promises: { readFile: readFileMock } };

jest.mock('fs', () => ({
  __esModule: true,
  default: fsMock,
  promises: fsMock.promises,
}));

jest.mock('../src/data-source.ts', () => ({ AppDataSource: { getRepository: jest.fn() } }));

let app: any;
let AppDataSource: any;
let currentRepoInner: any = {};

beforeAll(async () => {
  const ds = await import('../src/data-source.ts');
  AppDataSource = ds.AppDataSource;
  AppDataSource.getRepository = jest.fn(() => currentRepoInner);
  const mod = await import('../src/app.ts');
  app = mod.app;
});

const JWT_SECRET = 'super-secret-key-change-in-production';
const adminToken = jwt.sign({ id: 1, email: 'admin@example.com', role: { role_name: 'Admin' } }, JWT_SECRET);

describe('Bulk import endpoint', () => {
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = { create: jest.fn(), save: jest.fn() };
    currentRepoInner = mockRepository;
    fsMock.promises.readFile.mockReset();
  });

  afterEach(() => {
    currentRepoInner = {};
  });

  it('POST /books/bulk-import should read CSV and insert books', async () => {
    const csv = 'title,author,publishedYear\nBook A,Author A,2001\nBook B,Author B,2005';
    fsMock.promises.readFile.mockResolvedValue(csv as any);

    const created = [{ book_id: 1, book_title: 'Book A' }, { book_id: 2, book_title: 'Book B' }];
    mockRepository.save.mockResolvedValue(created);

    const res = await request(app)
      .post('/books/bulk-import')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ filePath: '/tmp/books.csv' });

    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
