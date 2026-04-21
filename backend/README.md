# Issue Tracker Backend

A complete backend for an Issue Tracker application built with **Node.js**, **Express.js**, and **MySQL**.

## Tech Stack

- Node.js + Express.js
- MySQL (`mysql2`)
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Validation (`Joi`)
- Environment variables (`dotenv`)

## Environment Variables

1. Copy `.env.example` to `.env`.
2. Update values in `.env` for your local MySQL setup and JWT secret.

Required variables:

- `PORT`
- `NODE_ENV`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Run the Project

Install dependencies:

```powershell
npm install
```

Start in development mode:

```powershell
npm run dev
```

Start in production mode:

```powershell
npm start
```

API base URL:

`http://localhost:5000/api`

## API Testing (Swagger)

Use Swagger UI to check APIs:

`http://localhost:5000/api-docs`

