package com.library.library_system;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import jakarta.transaction.Transactional;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;
    
    @Autowired
    private BookRepository bookRepository;

    @Autowired 
    private UserRepository userRepository;

    @Transactional
    public Loan borrowBook(Long bookId, Long userId) {
        // 1. Find the book or throw error
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new ResourceAccessException("Book not found")); // was ResourceNotFoundException and it is not available

        // 2. Business Rule: Check availability
        if (!book.isAvailable()) {
            throw new IllegalStateException("Book is currently checked out");
        }

        // 3. VALIDATION: Fetch the User using the UserRepository
        // This ensures you don't create a loan for a non-existent person
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // 4. Update Book status
        book.setAvailable(false);
        bookRepository.save(book);

        // 5. Create the Loan record
        Loan loan = new Loan();
        loan.setBook(book);
        loan.setUser(user); // Passing the real User object, not just an ID
        loan.setLoanDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(14)); // 2-week loan period


        return loanRepository.save(loan);
    }

    @Transactional
    public Loan returnBook(Long loanId) {
        // 1. Find the loan record
        Loan loan = loanRepository.findById(loanId)
            .orElseThrow(() -> new RuntimeException("Loan record not found"));

        // 2. Security Check: Ensure it wasn't already returned
        if (loan.getReturnDate() != null) {
            throw new IllegalStateException("This book has already been returned.");
        }

        // 3. Mark the book as available again
        Book book = loan.getBook();
        book.setAvailable(true);
        bookRepository.save(book);

        // 4. Close the loan
        loan.setReturnDate(LocalDate.now());
        
        return loanRepository.save(loan);
    }

}
