import { Router } from 'express';
import { BookController } from '../controllers/BookController.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts';
import { authorizeRoles } from '../middlewares/authorizeRoles.ts';

const router = Router();
const bookController = new BookController();

// Note: Using .bind() ensures 'this' context isn't lost inside the controller class
router.get('/', bookController.getBooks.bind(bookController));
router.get('/:id', bookController.getBookById.bind(bookController));
router.post('/', authenticateToken, authorizeRoles('Admin'), bookController.createBook.bind(bookController));
router.post('/bulk-import', authenticateToken, authorizeRoles('Admin'), bookController.bulkCreateBooksFromCsv.bind(bookController));
router.put('/:id', authenticateToken, authorizeRoles('Admin'), bookController.updateBook.bind(bookController));
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), bookController.deleteBook.bind(bookController));

export default router;

