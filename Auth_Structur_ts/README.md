# 🔐 Auth Service API

A secure, production-ready authentication system built with **TypeScript** and **Express.js**, featuring JWT-based access/refresh token flow, email verification, and password reset.

---

## ✨ Features

- User Signup & Login
- Email Verification
- Access & Refresh Token Authentication
- Refresh Token Rotation
- Forgot & Reset Password
- Protected Routes Middleware
- Secure Password Hashing with bcrypt
- HttpOnly Refresh Token Cookies

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Auth | JWT (Access + Refresh Tokens) |
| Password | bcrypt |
| Email | Nodemailer |

---

## 📁 Project Structure

```
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── schema/
│   └── index.ts
├── drizzle/
├── drizzle.config.ts
├── .env
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of your project:

```env
DATABASE_URL=your_database_url

PORT=8000

CLIENT_URL=http://localhost:3000

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

---

## 🐳 Database Setup (Docker)

```bash
docker-compose up -d
```

Then push the schema:

```bash
npm run db:push
```

---

## 🚀 Installation & Running

**Install dependencies:**

```bash
npm install
```

**Run development server:**

```bash
npm run dev
```

**Build for production:**

```bash
npm run build
```

---

## 🗄 Database Commands

| Command | Description |
|---|---|
| `npm run db:generate` | Generate migration files from schema |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:push` | Push schema directly to DB (dev) |
| `npm run db:studio` | Open Drizzle Studio GUI |

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Login and receive tokens |
| `POST` | `/auth/logout` | Logout and clear cookies |
| `POST` | `/auth/refresh` | Rotate refresh token |

### Email

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/auth/verify-email/:token` | Verify email address |
| `POST` | `/auth/forgot-password` | Send reset password email |
| `POST` | `/auth/reset-password/:token` | Reset password |

---

## 🔒 Security Features

- ✅ Password hashing using bcrypt
- ✅ JWT Access & Refresh Tokens
- ✅ Refresh token hashing in database
- ✅ Refresh token rotation
- ✅ HttpOnly cookies
- ✅ Protected route middleware

---

## 📄 License

MIT