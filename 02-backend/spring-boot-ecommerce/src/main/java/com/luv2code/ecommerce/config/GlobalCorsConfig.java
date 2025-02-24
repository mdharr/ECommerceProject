package com.luv2code.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//@Configuration
//public class GlobalCorsConfig {
//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")  // Apply to all routes
//                        .allowedOrigins("http://localhost:4200")  // Frontend origin
//                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Allowed methods
//                        .allowedHeaders("*")  // Allow all headers
//                        .allowCredentials(true);  // Allow credentials (cookies, etc.)
//            }
//        };
//    }
//}

