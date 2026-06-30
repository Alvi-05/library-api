import request from 'supertest';
import jwt from 'jsonwebtoken';
import { afterEach, beforeAll, beforeEach, describe, expect, it, jest, xit, } from '@jest/globals';

// Mock AppDataSource before importing app/controllers
jest.mock('../src/data-source.ts', () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

let app: any;
let AppDataSource: any;
let currentRepoInner: any = {};
const repoProxy = new Proxy({}, {
  get(_, prop: string) {
    return (...args: any[]) => {
      const fn = currentRepoInner[prop];
      if (typeof fn === 'function') return fn.apply(currentRepoInner, args);
      return undefined;
    };
  }
});

beforeAll(async () => {
  const ds = await import('../src/data-source.ts');
  AppDataSource = ds.AppDataSource;
  AppDataSource.getRepository = jest.fn(() => repoProxy);
  const mod = await import('../src/app.ts');
  app = mod.app;
});

const JWT_SECRET = 'super-secret-key-change-in-production';
const adminToken = jwt.sign({ id: 1, email: 'admin@example.com', role: { role_name: 'Admin' } }, JWT_SECRET);
const userToken = jwt.sign({ id: 2, email: 'user@example.com', role: { role_name: 'User' } }, JWT_SECRET);

describe('Role endpoints', () => {
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = { create: jest.fn(), save: jest.fn() };
    currentRepoInner = mockRepository;
  });

  afterEach(() => {
    currentRepoInner = {};
    jest.clearAllMocks();
  });

  it('POST /roles should allow Admin to create role', async () => {
    const role = { role_id: 1, role_name: 'Librarian' };
    mockRepository.create.mockReturnValue(role);
    mockRepository.save.mockResolvedValue(role);

    const res = await request(app)
      .post('/roles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role_name: 'Librarian', description: 'Manages books' });

    expect(res.status).toBe(201);
    expect(res.body.data.role_name).toBe('Librarian');
  });

  it('POST /roles should be forbidden for non-admin', async () => {
    const res = await request(app)
      .post('/roles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ role_name: 'Guest' });

    expect(res.status).toBe(403);
  });
});
