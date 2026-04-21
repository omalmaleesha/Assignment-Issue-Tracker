# Issue Tracker Backend

A complete backend for an Issue Tracker application built with **Node.js**, **Express.js**, and **MySQL**.

## Tech Stack

- Node.js + Express.js
- MySQL (`mysql2`)
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Validation (`Joi`)
- Environment variables (`dotenv`)

## Dependencies

### Production Dependencies

- `bcryptjs` `^2.4.3`
- `cors` `^2.8.5`
- `dotenv` `^16.4.5`
- `express` `^4.19.2`
- `joi` `^17.13.3`
- `jsonwebtoken` `^9.0.2`
- `morgan` `^1.10.0`
- `mysql2` `^3.11.3`
- `swagger-jsdoc` `^6.2.8`
- `swagger-ui-express` `^5.0.1`

### Development Dependencies

- `nodemon` `^3.1.4`

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

