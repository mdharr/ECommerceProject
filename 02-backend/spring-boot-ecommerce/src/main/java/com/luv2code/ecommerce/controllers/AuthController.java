package com.luv2code.ecommerce.controllers;

import com.luv2code.ecommerce.dtos.LoginRequest;
import com.luv2code.ecommerce.entities.Customer;
import com.luv2code.ecommerce.services.CaptchaService;
import com.luv2code.ecommerce.services.UserService;
import com.luv2code.ecommerce.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtil tokenUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CaptchaService captchaService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Customer customer) {
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        Customer registeredUser = userService.register(customer);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        if (!captchaService.verifyCaptcha(loginRequest.getCaptcha())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Captcha validation failed.");
        }
        Customer customer = userService.findByUsername(loginRequest.getUsername())
                .orElse(null);
        if(customer == null || !passwordEncoder.matches(loginRequest.getPassword(), customer.getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
        String token = tokenUtil.generateToken(customer.getUsername());
        return ResponseEntity.ok(token);
    }
}

