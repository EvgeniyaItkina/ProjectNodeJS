# Introduction

This project is a Node.js-based API designed for managing users, cards, and sessions. It includes user authentication, business management, and error handling with logging features.

### Features
User Management: Register, login, update, and delete users with role-based access control.
Card Management: Create, update, delete, and like business cards.
Session Handling: Implement session management with token-based authentication.
Error Logging: Automatic logging of errors (status codes 400 and above) into daily rotating log files.

### Installation

### Clone the repository:
[https://github.com/EvgeniyaItkina/ProjectNodeJS.git](https://github.com/EvgeniyaItkina/ProjectNodeJS.git) 

### Install dependencies:
npm install

### Start the development server:
npm start
Listening on: http://localhost:2024

# Endpoints
### User Endpoints
- **POST /users**: all users
- **POST /users/login**: all users
- **GET /user**: only for admin access
- **GET /user/:id**: only for registered user  or admin
- **GET /logout**: only for registered user or admin
- **PUT /user/:id**: only for registered user
- **PATCH /user/:id**: only for registered user
- **DELETE /user/:id**: only for registered user or admin

### Cards Endpoints
- **GET /cards**: all users
- **GET /cards/my-cards**: only for registered user
- **GET /cards/:id**: all users
- **POST /cards**: only business user
- **PUT /cards/:id**: only user who created the card
- **PATCH /cards/:id**: only for registered user
- **DELETE /cards/:id**: only user who created the card or admin

### Logging
All requests are logged in access.log.
Errors (status code 400 and above) are logged separately in daily rotating errors.log files.

Testing
To test the API, use Postman with the provided [API Documentation](https://documenter.getpostman.com/view/36795431/2sA3sAhTVf#f8d29a03-0cea-41ce-8cce-351c8c867ff1) .

## Technologies Used
* bcrypt
* express
* jwt
* chalk
* cors
* .env
* fs
* joi
* moment
* mongoose
* morgan

