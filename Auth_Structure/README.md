# Auth System Architecture & Implementation Guide

This document details the architectural patterns, security standards, and technical design decisions implemented in this Authentication System.

---

## 1. Architectural Pattern: Layered Architecture
The project follows a **Layered Architecture** (also known as the **Service Layer Pattern**). This design adheres to the **Separation of Concerns (SoC)** principle, ensuring that each component has a singular responsibility.

### **A. Route Layer (Transport & Validation)**
* **Responsibility:** Defines API endpoints and handles incoming HTTP requests.
* **Validation:** Utilizes **DTO (Data Transfer Object)** middleware to validate the request body before it reaches the controller.
* **Benefit:** Prevents malformed data from entering the business logic, reducing processing overhead and increasing security.

### **B. Controller Layer (The Orchestrator)**
* **Responsibility:** Acts as a bridge between the Routes and the Services.
* **Logic:** It extracts data from `req.body`, `req.params`, and `req.cookies`, then delegates tasks to the appropriate service.
* **Error Handling:** Implements `try-catch` blocks and the `next(error)` function to pass exceptions to a **Centralized Error Handler**.

### **C. Service Layer (Business Logic)**
* **Responsibility:** Contains the core "brain" of the application. All database interactions (Mongoose), token generation logic, and third-party integrations (Email/SMTP) reside here.
* **Benefit:** High reusability and testability. The business logic is decoupled from the Express framework, making it framework-agnostic.

### **D. Data Access Layer (Models)**
* **Responsibility:** Defines the data schema using Mongoose.
* **Hooks:** Uses `pre-save` hooks for automated tasks like password hashing, ensuring security is baked into the data layer.

---

## 2. Security Implementation

### **Authentication Strategy**
The system employs a **Dual-Token Strategy** using JSON Web Tokens (JWT):
* **Access Tokens:** Short-lived tokens used for authorization in every request.
* **Refresh Tokens:** Long-lived tokens used to generate new access tokens.
* **Storage:** Refresh tokens are stored in **HttpOnly, Secure, and SameSite=Strict cookies**. This configuration significantly mitigates the risk of **XSS (Cross-Site Scripting)** and **CSRF (Cross-Site Request Forgery)** attacks.

### **Password Safety**
* **Hashing:** Passwords are never stored in plain text. They are hashed using a salted hashing algorithm via model middleware.
* **Comparison:** Custom model methods are used to compare plain text passwords with stored hashes during login.

---

## 3. Reliability & Error Handling

### **Centralized Error Management**
Instead of scattered `res.status().json()` calls, the project uses a custom `apiError` class.
1.  **Throw:** The Service layer throws a specific error (e.g., `404 Not Found`).
2.  **Catch:** The Controller catches the error and passes it to `next(error)`.
3.  **Handle:** A global middleware in `app.js` formats the error into a consistent JSON response for the client.

### **Standardized Responses**
An `ApiResponse` utility class is used to maintain a uniform structure for all successful responses:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}