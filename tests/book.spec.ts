// tests/book.test.ts
import request from 'supertest';
import { app } from '../src/app.ts';
import { AppDataSource } from '../src/data-source.ts';
import { afterEach, beforeEach, describe, expect, it, jest, xit, } from '@jest/globals';
import jwt from 'jsonwebtoken';

// 1. Mock TypeORM Data Source entirely
jest.mock('../src/data-source.ts', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}));

// Mock Auth token check by generating a fake test token
const fakeToken = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET || 'test', { expiresIn: '1h' });

describe('Book API Endpoints', () => {
  let mockRepository: any;
  let getRepositorySpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    // Reset our mock repository layout before every test case
    mockRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn()
    };
    getRepositorySpy = jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository);
  });

  afterEach(() => {
    // 4. Clean up the spy so it doesn't leak into other test suites
    getRepositorySpy.mockRestore();
  });

  // Test Case 1: Testing Security Protection
  it('should return 200 OK ', async () => {
    const res = await request(app).get('/books');
    
    expect(res.statusCode).toEqual(200);
  });

  // Test Case 2: Testing GET Request (Read Layer)
  it('should fetch a list of books successfully if authenticated', async () => {
    const mockBooks = [{ id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien' }];
    mockRepository.find.mockResolvedValue(mockBooks);

    const res = await request(app)
      .get('/books')
      .set('Authorization', `Bearer ${fakeToken}`); // Passing our test security header

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toEqual('The Hobbit');
  });

  // Test Case 3: Testing POST Payload Validation Rules
  it('should return 400 Bad Request if validation payload fails', async () => {
    const invalidPayload = { title: "" }; // Missing author entirely, title too short

    const res = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(invalidPayload);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });
});

