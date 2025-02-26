package com.luv2code.ecommerce.controllers;

import com.luv2code.ecommerce.dtos.LoginRequest;
import com.luv2code.ecommerce.entities.Customer;
import com.luv2code.ecommerce.services.CaptchaService;
import com.luv2code.ecommerce.services.CustomerService;
import com.luv2code.ecommerce.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

//@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("api/v1/auth")
public class AuthController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private JwtTokenUtil tokenUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CaptchaService captchaService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Customer customer) {
        // Hash the password and save the customer to the database
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        Customer registeredUser = customerService.register(customer);

        // Generate a JWT for the registered user
        String token = tokenUtil.generateToken(registeredUser.getUsername(), registeredUser.getId(), registeredUser.getFirstName());

        // Return the token as part of the response body
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("token", token);
//        return ResponseEntity.ok(registeredUser);
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
//        if (!captchaService.verifyCaptcha(loginRequest.getCaptcha())) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Captcha validation failed.");
//        }
        Customer customer = customerService.findByUsername(loginRequest.getUsername())
                .orElse(null);
        if(customer == null || !passwordEncoder.matches(loginRequest.getPassword(), customer.getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
        String token = tokenUtil.generateToken(customer.getUsername(), customer.getId(), customer.getFirstName());

        // Return a JSON object with a "token" property
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("token", token);
        return ResponseEntity.ok(responseBody);
    }
}

