package com.luv2code.ecommerce.services;

import com.luv2code.ecommerce.entities.Customer;

import java.util.Optional;

public interface CustomerService {
    Customer register(Customer customer);
    Optional<Customer> findByUsername(String username);
    Optional<Customer> findById(Long id);
}
