import { AppDataSource } from '../data-source.ts';
import { Book } from '../entities/Book.ts';
import { Logger } from '../utils/Logger.ts';

export let isBookDatabaseConnected = true;

export const setBookDatabaseConnected = (value: boolean) => {
  isBookDatabaseConnected = value;
};

export class BookService {

  // Getter
  private get bookRepository() {
    if (!isBookDatabaseConnected) {
      throw new Error('Book database connection is down');
    }
    return AppDataSource.getRepository(Book);
  }

  // GET: ALL
  public async getAllBooks(): Promise<Book[]> {
    Logger.info(`BookService: Fetching all books`);
    return await this.bookRepository.find({ order: { book_id: 'ASC' } });
  }

  // GET: ID
  public async findBookById(book_id: number): Promise<Book | null> {
    Logger.info(`BookService: Fetching book by id`, { book_id });
    return await this.bookRepository.findOneBy({book_id});
  }

  // POST
  public async createBook(book_title: string, author: string, publishedYear: number = 0): Promise<Book> {
    Logger.info(`BookService: Creating a book`, { book_title, author, publishedYear });
    const newBook = this.bookRepository.create({ book_title, author, publishedYear });
    return await this.bookRepository.save(newBook);
  }

  // POST: Create multiple books
  public async bulkInsert(booksData: any[]): Promise<Book[]> {
    Logger.info(`BookService: Processing bulk insert for ${booksData.length} records`);
    
    // .create prepares the array of objects into an array of TypeORM Book Entities
    const entities = this.bookRepository.create(booksData);
    // .save automatically executes a bulk SQL insert
    return await this.bookRepository.save(entities);
  }

  // PUT
  public async updateBook(book: Book, updates: { book_title?: string; author?: string; publishedYear?: number }): Promise<Book | null> {
    Logger.info(`BookService: Updating book`, { book_id: book.book_id, updates });
    Object.assign(book, updates);
    return await this.bookRepository.save(book);
  }

  // DELETE
  public async deleteBook(book: Book): Promise<Book | null> {
    Logger.info(`BookService: Deleting book`, { book_id: book.book_id });
    await this.bookRepository.remove(book);
    return book;
}
}