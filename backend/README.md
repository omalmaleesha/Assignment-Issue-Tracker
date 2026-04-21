# Issue Tracker Backend

A complete backend for an Issue Tracker application built with **Node.js**, **Express.js**, and **MySQL**.

## Tech Stack

- Node.js + Express.js
- MySQL (`mysql2`)
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Validation (`Joi`)
- Environment variables (`dotenv`)

## Folder Structure

```text
backend/
├── .env.example
├── package.json
├── README.md
├── sql/
│   └── schema.sql
└── src/
		├── app.js
		├── server.js
		├── config/
		│   └── db.js
		├── controllers/
		│   ├── authController.js
		│   └── issueController.js
		├── middleware/
		│   ├── authMiddleware.js
		│   ├── errorMiddleware.js
		│   └── validateRequest.js
		├── models/
		│   ├── issueModel.js
		│   └── userModel.js
		├── routes/
		│   ├── authRoutes.js
		│   ├── index.js
		│   └── issueRoutes.js
		├── utils/
		│   └── ApiError.js
		└── validators/
				├── authValidators.js
				└── issueValidators.js
```

## Database Setup

1. Create the database and tables using:
	 - `sql/schema.sql`
2. Make sure MySQL is running.

## Environment Variables

1. Copy `.env.example` to `.env`
2. Update the values for your local MySQL and JWT secret.

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

When you start the server (`npm run dev` or `npm start`), the app will automatically:

- Connect to MySQL
- Create the configured database if it does not exist
- Create required tables and indexes if they do not exist

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

Base URL:

`http://localhost:5000/api`

Swagger UI:

`http://localhost:5000/api-docs`

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Issues (JWT Protected)

- `POST /api/issues`
- `GET /api/issues`
- `GET /api/issues/export/json` (download JSON)
- `GET /api/issues/:id`
- `PUT /api/issues/:id`
- `DELETE /api/issues/:id`
- `PATCH /api/issues/:id/status`

## curl Examples

### 1) Register

```powershell
curl -X POST "http://localhost:5000/api/auth/register" ^
	-H "Content-Type: application/json" ^
	-d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

### 2) Login

```powershell
curl -X POST "http://localhost:5000/api/auth/login" ^
	-H "Content-Type: application/json" ^
	-d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

Copy the returned token and set it below:

```powershell
$TOKEN="<your_jwt_token_here>"
```

### 3) Create Issue

```powershell
curl -X POST "http://localhost:5000/api/issues" ^
	-H "Authorization: Bearer $TOKEN" ^
	-H "Content-Type: application/json" ^
	-d "{\"title\":\"Login page bug\",\"description\":\"Login fails on invalid redirect\",\"priority\":\"High\",\"status\":\"Open\"}"
```

### 4) Get Issues (pagination + filters + search)

```powershell
curl "http://localhost:5000/api/issues?page=1&limit=10&status=Open&priority=High&search=login" ^
	-H "Authorization: Bearer $TOKEN"
```

### 5) Get Single Issue

```powershell
curl "http://localhost:5000/api/issues/1" ^
	-H "Authorization: Bearer $TOKEN"
```

### 5.1) Download Issues as JSON

```powershell
curl "http://localhost:5000/api/issues/export/json?status=Open&priority=High&search=login" ^
	-H "Authorization: Bearer $TOKEN" ^
	-o "issues-export.json"
```

### 6) Update Issue

```powershell
curl -X PUT "http://localhost:5000/api/issues/1" ^
	-H "Authorization: Bearer $TOKEN" ^
	-H "Content-Type: application/json" ^
	-d "{\"title\":\"Login bug fixed scope\",\"priority\":\"Medium\",\"status\":\"In Progress\"}"
```

### 7) Update Status (Resolved/Closed)

```powershell
curl -X PATCH "http://localhost:5000/api/issues/1/status" ^
	-H "Authorization: Bearer $TOKEN" ^
	-H "Content-Type: application/json" ^
	-d "{\"status\":\"Resolved\"}"
```

### 8) Delete Issue

```powershell
curl -X DELETE "http://localhost:5000/api/issues/1" ^
	-H "Authorization: Bearer $TOKEN"
```

## Notes

- All issue routes are protected with JWT middleware.
- Users can only access and modify their own issues.
- Validation is applied to request body, query, and params.
- Errors are handled centrally with a global error middleware.

