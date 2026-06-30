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
  // make getRepository return a proxy that delegates to currentRepoInner
  AppDataSource.getRepository = jest.fn(() => repoProxy);
  const mod = await import('../src/app.ts');
  app = mod.app;
});

const JWT_SECRET = 'super-secret-key-change-in-production';
const adminToken = jwt.sign({ id: 1, email: 'admin@example.com', role: { role_name: 'Admin' } }, JWT_SECRET);
const userToken = jwt.sign({ id: 2, email: 'user@example.com', role: { role_name: 'User' } }, JWT_SECRET);

describe('Loan endpoints', () => {
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn()
    };
    // swap in the per-test repository for modules that already captured getRepository
    currentRepoInner = mockRepository;
  });

  afterEach(() => {
    currentRepoInner = {};
    jest.clearAllMocks();
  });

  it('POST /loans/issue should allow Admin to issue a book', async () => {
    const loan = { loan_id: 1, user: { user_id: 2 }, book: { book_id: 3 }, status: 'Issued' };
    mockRepository.create.mockReturnValue(loan);
    mockRepository.save.mockResolvedValue(loan);

    const res = await request(app)
      .post('/loans/issue')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ user_id: 2, book_id: 3, due_date: '2026-07-10' });

    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
    expect(mockRepository.create).toHaveBeenCalled();
  });

  it('GET /loans/my-loans should return loans for authenticated user', async () => {
    const loans = [{ loan_id: 10, book: { book_id: 5, book_title: 'X' }, status: 'Issued' }];
    mockRepository.find.mockResolvedValue(loans);

    const res = await request(app)
      .get('/loans/my-loans')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].loan_id).toBe(10);
  });

  it('POST /loans/return/:id should mark loan returned (Admin)', async () => {
    const loan = { loan_id: 2, status: 'Issued', returned_date: null };
    mockRepository.findOne.mockResolvedValue(loan);
    mockRepository.save.mockResolvedValue({ ...loan, status: 'Returned', returned_date: '2026-07-01' });

    const res = await request(app)
      .post('/loans/return/2')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Returned');
  });
});
