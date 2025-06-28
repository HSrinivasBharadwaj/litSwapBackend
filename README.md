# LitSwap Backend

LitSwap is a book swapping platform that allows users to list books, request swaps, and manage their profiles securely. This repository contains the backend code built with Node.js, Express, and MongoDB.

---

## Features

- **User Authentication:**  
  Secure signup, login, logout, and JWT-based authentication.

- **Profile Management:**  
  View and edit user profile, change password, and forgot password functionality.

- **Book Management:**  
  - List a new book for swapping.
  - View all books.
  - Edit or delete your own books.
  - Search and filter books by title, author, or genre //TTD.

- **Swap Requests:**  
  - Send a swap request for a book.
  - View received swap requests.
  - Accept or reject swap requests.

- **Validation & Security:**  
  - Input validation using `validator`.
  - Password hashing with `bcrypt`.
  - Protected routes with authentication middleware.

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)


### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/litswap-backend.git
   cd litswap-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=7777
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:7777`.

---

## API Endpoints

### Auth

- `POST /user/signup` — Register a new user
- `POST /user/login` — Login and receive JWT token
- `POST /user/logout` — Logout and clear token

### Profile

- `GET /view/profile` — View user profile
- `PATCH /edit/profile` — Edit user profile
- `PATCH /forgot/password` — Change password (authenticated)
- `PATCH /forgotpassword` — Forgot password (with validation)

### Books

- `GET /view/allbooks` — View all books
- `POST /post/book` — List a new book
- `PATCH /edit/book/:id` — Edit a book (owner only)
- `DELETE /delete/book/:id` — Delete a book (owner only)
- `GET /get/book/:id` — Get a book by ID


### Requests

- `POST /request/send` — Send a swap request
- `GET /request/received` — View received requests
- `PATCH /request/respond` — Accept or reject a request

---

## Folder Structure

```
src/
  models/         # Mongoose models (User, Book, Request)
  routes/         # Express route handlers
  middlewares/    # Authentication and other middleware
  utils/          # Utility functions (validation, etc.)
  app.js          # Main Express app
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [validator](https://www.npmjs.com/package/validator)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
