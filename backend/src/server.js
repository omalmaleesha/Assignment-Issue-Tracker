require('dotenv').config();

const app = require('./app');
const pool = require('./config/db');
const { initializeDatabase } = require('./config/dbInitializer');

const PORT = Number(process.env.PORT || 5000);

const REQUIRED_ENV_VARS = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];

const validateEnvironment = () => {
	const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

	if (missing.length) {
		throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
	}
};

const startServer = async () => {
	try {
		validateEnvironment();
		await initializeDatabase();
		console.log('✅ Database and required tables are ready');

		await pool.query('SELECT 1');
		console.log('✅ Database connected successfully');

		app.listen(PORT, () => {
			console.log(`🚀 Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('❌ Failed to start server:', error.message);
		process.exit(1);
	}
};

startServer();

