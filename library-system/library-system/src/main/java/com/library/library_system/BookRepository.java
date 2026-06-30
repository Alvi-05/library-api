package com.library.library_system;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Custom query to find books by status
    List<Book> findByIsAvailable(boolean available);
}

