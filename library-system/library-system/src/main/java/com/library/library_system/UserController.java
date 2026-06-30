package com.library.library_system;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // GET all users (This is what you'll see in the browser)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // POST a new user (This is what you'll use the extension for)
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}