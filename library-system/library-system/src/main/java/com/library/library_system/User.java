package com.library.library_system;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "users") // 'user' is often a reserved keyword in SQL, so 'users' is safer
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    
    private String name;
    
    @Column(unique = true)
    private String email;

    // One user can have many loans
    // 'mappedBy' tells JPA that the 'user' field in the Loan class owns the relationship
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private  List<Loan> loans = new ArrayList<>();

    public User() {}
}