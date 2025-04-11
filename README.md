# Full Stack E-Commerce Application

A comprehensive e-commerce platform built with Spring Boot and Angular, featuring product catalog management, shopping cart functionality, checkout process with Stripe payment integration, and robust security features.

## Project Overview

This project is a full-stack e-commerce application consisting of a Spring Boot backend and an Angular frontend. It enables users to browse products, add items to their cart, manage their orders, and complete purchases using credit card payments via Stripe integration. The application includes authentication and authorization using JSON Web Tokens.

## Features

- **Product Catalog**: Browse products by category with search capabilities
- **Shopping Cart**: Add, update, and remove items from shopping cart
- **User Authentication**: Login/logout functionality with JWT
- **User Profile Management**: View and update user details
- **Checkout Process**: Complete order process with shipping information
- **Payment Gateway**: Integrated Stripe for secure credit card payments
- **Order History**: View past orders and details
- **Security**: Protected API endpoints with proper authorization

## Technology Stack

### Backend
- **Java**: JDK 17+
- **Spring Boot**: Core framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database access and ORM
- **RESTful API**: For client-server communication
- **JWT**: For secure authentication
- **MySQL**: Database
- **Maven**: Dependency management
- **Stripe API**: Payment processing

### Frontend
- **Angular**: Frontend framework
- **TypeScript**: Programming language
- **HTML/CSS**: Markup and styling
- **Bootstrap**: Responsive design
- **Angular Reactive Forms**: Form handling
- **Angular Router**: Navigation
- **Angular Guards & Interceptors**: Security
- **Services**: API communication and state management

## Project Structure

### Backend (`02-backend/spring-boot-ecommerce`)
```
spring-boot-ecommerce/
├── src/
│   ├── main/
│   │   ├── java/com/luv2code/ecommerce/
│   │   │   ├── config/                  # Configuration classes
│   │   │   │   ├── MyDataRestConfig.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controllers/             # REST controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   └── CheckoutController.java
│   │   │   ├── dtos/                    # Data Transfer Objects
│   │   │   │   ├── CustomerDTO.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── PaymentInfo.java
│   │   │   │   ├── Purchase.java
│   │   │   │   └── PurchaseResponse.java
│   │   │   ├── entities/                # JPA entity classes
│   │   │   │   ├── Address.java
│   │   │   │   ├── Country.java
│   │   │   │   ├── Customer.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── OrderItem.java
│   │   │   │   ├── Product.java
│   │   │   │   ├── ProductCategory.java
│   │   │   │   └── State.java
│   │   │   ├── exceptions/              # Custom exception handlers
│   │   │   │   ├── CustomerNotFoundException.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   ├── repositories/            # Spring Data repositories
│   │   │   │   ├── CountryRepository.java
│   │   │   │   ├── CustomerRepository.java
│   │   │   │   ├── OrderRepository.java
│   │   │   │   ├── ProductCategoryRepository.java
│   │   │   │   ├── ProductRepository.java
│   │   │   │   └── StateRepository.java
│   │   │   ├── security/                # Security-related classes
│   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── JwtTokenUtil.java
│   │   │   ├── services/                # Service layer
│   │   │   │   ├── CaptchaService.java
│   │   │   │   ├── CheckoutService.java
│   │   │   │   ├── CheckoutServiceImpl.java
│   │   │   │   ├── CustomerService.java
│   │   │   │   └── CustomerServiceImpl.java
│   │   │   ├── utils/                   # Utility classes
│   │   │   │   ├── EnvChecker.java
│   │   │   │   └── SpringBootEcommerceApplication.java
│   │   └── resources/                   # Configuration files and static resources
│   └── test/                            # Test classes
├── pom.xml                              # Maven dependencies and build config
└── mvnw                                 # Maven wrapper script
```

### Frontend (`03-frontend/angular-ecommerce`)
```
angular-ecommerce/
├── src/
│   ├── app/
│   │   ├── components/                  # Angular components
│   │   │   ├── cart-details/            # Shopping cart details
│   │   │   ├── cart-status/             # Cart status indicator
│   │   │   ├── checkout/                # Checkout process
│   │   │   ├── login/                   # User login
│   │   │   ├── login-status/            # Login status indicator
│   │   │   ├── members-page/            # Member-only content
│   │   │   ├── order-history/           # Order history display
│   │   │   ├── product-category-menu/   # Product categories navigation
│   │   │   ├── product-details/         # Product details page
│   │   │   ├── product-list/            # List of products
│   │   │   ├── register/                # User registration
│   │   │   └── search/                  # Product search
│   │   ├── config/                      # Configuration
│   │   ├── guards/                      # Route guards for protection
│   │   ├── interceptors/                # HTTP interceptors
│   │   ├── models/                      # TypeScript model interfaces
│   │   │   ├── address.ts
│   │   │   ├── cart-item.ts
│   │   │   ├── country.ts
│   │   │   ├── customer.ts
│   │   │   ├── order-history.ts
│   │   │   ├── order-item.ts
│   │   │   ├── order.ts
│   │   │   ├── payment-info.ts
│   │   │   ├── product-category.ts
│   │   │   ├── product.ts
│   │   │   ├── purchase.ts
│   │   │   └── state.ts
│   │   ├── services/                    # Services for API communication
│   │   │   ├── auth.service.ts          # Authentication service
│   │   │   ├── cart.service.ts          # Shopping cart service
│   │   │   ├── checkout.service.ts      # Checkout process service
│   │   │   ├── luv2-shop-form.service.ts # Form-related service
│   │   │   ├── order-history.service.ts # Order history service
│   │   │   └── product.service.ts       # Product data service
│   │   └── validators/                  # Custom form validators
│   ├── assets/                          # Static assets (images, etc.)
│   ├── environments/                    # Environment configuration
│   ├── index.html                       # Main HTML file
│   └── styles.css                       # Global styles
├── angular.json                         # Angular CLI configuration
├── package.json                         # NPM dependencies
└── tsconfig.json                        # TypeScript configuration
```

## Installation and Setup

### Prerequisites
- JDK 17 or higher
- Node.js 14+ and npm
- MySQL 8+
- Maven
- Angular CLI

### Backend Setup
1. Clone the repository
2. Configure the database connection in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce?useSSL=false&serverTimezone=UTC
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```
3. Configure Stripe API keys in `application.properties`:
   ```properties
   stripe.key.secret=your_stripe_secret_key
   ```
4. Navigate to the backend directory:
   ```
   cd 02-backend/spring-boot-ecommerce
   ```
5. Build and run the backend:
   ```
   mvn clean install
   mvn spring-boot:run
   ```
   The backend server will start on http://localhost:8080

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd 03-frontend/angular-ecommerce
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Configure the API URL in `environment.ts` (if necessary):
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     stripePublishableKey: 'your_stripe_publishable_key'
   };
   ```
4. Start the development server:
   ```
   ng serve
   ```
   The application will be available at http://localhost:4200

## Security Features

- **JWT Authentication**: Token-based authentication for API access
- **SSL/TLS**: Secure communication
- **Role-based Authorization**: Different access levels based on user roles
- **Form Validation**: Client-side and server-side validation

## Payment Processing

The application uses Stripe for payment processing, allowing users to securely make purchases using credit cards without storing sensitive payment information on the server.

## Future Enhancements

- Admin dashboard for inventory management
- Advanced product filtering
- Wishlists and favorites
- Product reviews and ratings
- Discount codes and promotions
- Email notifications
- Multi-language support
- Mobile responsiveness optimizations