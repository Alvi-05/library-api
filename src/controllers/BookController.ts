import fs from "fs";
import type { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/BookService.ts';
import { Logger } from '../utils/Logger.ts';

export class BookController {
  private bookService = new BookService(); 

  // Fetch book from ID. Data Helper, Not an Express router
  private async resolveBookFromParams(req: Request, res: Response){
    Logger.info(`BookController: resolveBookFromParams called`, { params: req.params });
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, error: 'Book ID parameter is required' });
      return null;
    }

    const bookId = parseInt(id.toString(), 10);
    if (isNaN(bookId)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return null;
    }

    const book = await this.bookService.findBookById(bookId);
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return null;
    }

    return book;
  }

  // GET: Get all books
  public async getBooks(req: Request, res: Response, next: NextFunction) {
    Logger.info(`BookController: GET /books triggered`);
    try {

    const books = await this.bookService.getAllBooks();
    res.status(200).json(books);
    Logger.info(`BookController: Successfully fetched all books`, { count: books.length });

    } catch (error) {
      Logger.error(`BookController: Error in getBooks`, { error });
      next(error);
    }
  }

  // GET: Get book by ID
  public async getBookById (req: Request, res: Response, next: NextFunction){
    Logger.info(`BookController: GET /books/:id triggered`, { params: req.params });
    try {
      const book = await this.resolveBookFromParams(req, res);
      if (!book) return;

      res.status(200).json(book);
      Logger.info(`BookController: Successfully fetched book by ID`, { book_id: book.book_id });
    } catch (error) {
        Logger.error(`BookController: Error in getBookById`, { error });
        next(error);
    }
  }

  // POST: Create a new book
  public async createBook(req: Request, res: Response, next: NextFunction) {
    Logger.info(`BookController: POST /books triggered`, { body: req.body });
    try {
      const { title, author, publishedYear } = req.body;

      if (!title || typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ success: false, error: "Validation failed: 'title' is required and must be a string." });
        return;
      }

      if (!author || typeof author !== 'string' || author.trim() === '') {
        res.status(400).json({ success: false, error: "Validation failed: 'author' is required and must be a string." });
        return;
      }

      const book = await this.bookService.createBook(title, author, publishedYear);
      Logger.info(`BookController: Successfully created book`, { book_id: book.book_id });
      res.status(201).json({ message: 'Book created', data: book });

    } catch (error) {
      Logger.error(`BookController: Error in createBook`, { error });
      next(error);
    }
  }

  // POST: Create books in bulk from a CSV file path
  public async bulkCreateBooksFromCsv(req: Request, res: Response, next: NextFunction) {
    Logger.info(`BookController: POST /books/bulk-import triggered`, { body: req.body });
    try {
      const { filePath } = req.body;

      if (!filePath || typeof filePath !== 'string') {
        res.status(400).json({ success: false, error: "Validation failed: 'filePath' is required and must be a string." });
        return;
      }

      const rawCsv = await fs.promises.readFile(filePath, 'utf-8');
      const lines = rawCsv.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

      if (lines.length < 2) {
        res.status(400).json({ success: false, error: 'CSV file must include a header row and at least one data row.' });
        return;
      }

      const header = lines[0]?.split(',').map(field => field.trim().toLowerCase()) ?? [];
      const expectedHeader = ['title', 'author', 'publishedyear'];

      if (header.length < 2 || !expectedHeader.every((column, index) => header[index] === column)) {
        res.status(400).json({
          success: false,
          error: "CSV header must be: title,author,publishedYear",
        });
        return;
      }

      const booksData = lines.slice(1).map((line, index) => {
        const cols = line.split(',').map(col => col.trim());
        return {
          book_title: cols[0] ?? '',
          author: cols[1] ?? '',
          publishedYear: cols[2] ? Number(cols[2]) : 0,
          rowIndex: index + 2,
        };
      });

      const invalidRow = booksData.find(row => !row.book_title || !row.author || Number.isNaN(row.publishedYear));
      if (invalidRow) {
        res.status(400).json({
          success: false,
          error: `Invalid row in CSV at line ${invalidRow.rowIndex}. Ensure title and author are set and publishedYear is numeric.`,
        });
        return;
      }

      const insertData = booksData.map(({ book_title, author, publishedYear }) => ({ book_title, author, publishedYear }));
      const createdBooks = await this.bookService.bulkInsert(insertData);

      Logger.info(`BookController: Successfully created books`, { count: createdBooks.length });
      res.status(201).json({ success: true, message: 'Bulk book import completed', data: createdBooks });
    } catch (error) {
      Logger.error(`BookController: Error in bulkCreateBooksFromCsv`, { error });
      next(error);
    }
  }

  // PUT: Update an existing Book
  public async updateBook(req: Request, res: Response, next: NextFunction,){
    Logger.info(`BookController: PUT /books/:id triggered`, { params: req.params, body: req.body });
    try {
        const book = await this.resolveBookFromParams(req, res);
        if (!book) return;

        const { title, author, publishedYear } = req.body;

        if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        res.status(400).json({ success: false, error: "Validation failed: 'title' must be a valid string." });
        return;
        }
        if (author !== undefined && (typeof author !== 'string' || author.trim() === '')) {
        res.status(400).json({ success: false, error: "Validation failed: 'author' must be a valid string." });
        return;
        }

        const updates: any = {};
        if (title !== undefined) updates.book_title = title;
        if (author !== undefined) updates.author = author;
        if (publishedYear !== undefined) {
        updates.publishedYear = publishedYear ?? 0;
        }

        const updatedBook = await this.bookService.updateBook(book, updates);
        res.status(200).json({message: 'Book Updated', data: updatedBook});
        Logger.info(`BookController: Successfully updated book`, { book_id: updatedBook?.book_id });

    } catch (error) {
      Logger.error(`BookController: Error in updateBook`, { error });
      next(error);
    }
  }

  // DELETE: Delete a Book by id
  public async deleteBook (req: Request, res: Response, next: NextFunction){
    Logger.info(`BookController: DELETE /books/:id triggered`, { params: req.params });
    try {
      const book = await this.resolveBookFromParams(req, res);
      if (!book) return;

      await this.bookService.deleteBook(book);
      res.status(204).send();
      Logger.info(`BookController: Successfully deleted book`, { book_id: book.book_id });
    } catch (error) {
      Logger.error(`BookController: Error in deleteBook`, { error });
      next(error);
    }
  }

}