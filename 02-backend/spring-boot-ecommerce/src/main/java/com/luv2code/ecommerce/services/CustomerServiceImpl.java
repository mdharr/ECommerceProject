package com.luv2code.ecommerce.services;

import com.luv2code.ecommerce.repositories.CustomerRepository;
import com.luv2code.ecommerce.entities.Customer;
import com.luv2code.ecommerce.exceptions.CustomerNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Customer register(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Optional<Customer> findByUsername(String username) {
        return Optional.ofNullable(customerRepository.findByUsername(username)
                .orElseThrow(() -> new CustomerNotFoundException("User not found with username: " + username)));
    }

    @Override
    public Optional<Customer> findById(Long id) {
        return Optional.ofNullable(customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("User not found with id: " + id)));
    }
}
