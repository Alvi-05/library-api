package com.library.library_system;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LibraryService {
    @Autowired private BookRepository bookRepo;
    @Autowired private LoanRepository loanRepo;

    @Transactional
    public Loan processLoan(Long bookId, Long userId) {
        Book book = bookRepo.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));

        if (!book.isAvailable()) {
            throw new RuntimeException("Book is already checked out!");
        }

        // Update book status
        book.setAvailable(false);
        bookRepo.save(book);

        // Create loan record
        Loan loan = new Loan();
        loan.setBook(book);
        loan.setId(userId);
        loan.setLoanDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(14));
        
        return loanRepo.save(loan);
    }
}