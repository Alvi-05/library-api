package com.library.library_system;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/library")
public class LibraryController {
    
    @Autowired private LibraryService libraryService;

    @PostMapping("/borrow")
    public Loan borrowBook(@RequestParam Long bookId, @RequestParam Long userId) {
        return libraryService.processLoan(bookId, userId);
    }
}
