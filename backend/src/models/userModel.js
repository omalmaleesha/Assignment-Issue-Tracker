const pool = require('../config/db');

const findUserByEmail = async (email) => {
	const [rows] = await pool.query('SELECT id, email, password, created_at FROM users WHERE email = ?', [email]);
	return rows[0] || null;
};

const createUser = async ({ email, password }) => {
	const [result] = await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);

	const [rows] = await pool.query('SELECT id, email, created_at FROM users WHERE id = ?', [result.insertId]);
	return rows[0];
};

module.exports = {
	findUserByEmail,
	createUser
};

