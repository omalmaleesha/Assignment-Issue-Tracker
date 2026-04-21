const pool = require('../config/db');

const createIssue = async ({ title, description, status, priority, userId }) => {
	const [result] = await pool.query(
		'INSERT INTO issues (title, description, status, priority, user_id) VALUES (?, ?, ?, ?, ?)',
		[title, description, status, priority, userId]
	);

	const [rows] = await pool.query(
		'SELECT id, title, description, status, priority, user_id, created_at, updated_at FROM issues WHERE id = ?',
		[result.insertId]
	);

	return rows[0];
};

const buildIssueFilters = ({ userId, status, priority, search }) => {
	const whereParts = ['user_id = ?'];
	const whereValues = [userId];

	if (status) {
		whereParts.push('status = ?');
		whereValues.push(status);
	}

	if (priority) {
		whereParts.push('priority = ?');
		whereValues.push(priority);
	}

	if (search) {
		whereParts.push('title LIKE ?');
		whereValues.push(`%${search}%`);
	}

	return {
		whereClause: `WHERE ${whereParts.join(' AND ')}`,
		whereValues
	};
};

const getIssues = async ({ userId, page, limit, status, priority, search }) => {
	const { whereClause, whereValues } = buildIssueFilters({ userId, status, priority, search });
	const offset = (page - 1) * limit;

	const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM issues ${whereClause}`, whereValues);
	const total = Number(countRows[0].total || 0);

	const [rows] = await pool.query(
		`SELECT id, title, description, status, priority, user_id, created_at, updated_at
		 FROM issues
		 ${whereClause}
		 ORDER BY created_at DESC
		 LIMIT ? OFFSET ?`,
		[...whereValues, limit, offset]
	);

	return {
		data: rows,
		pagination: {
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit) || 1
		}
	};
};

const getIssuesForExport = async ({ userId, status, priority, search }) => {
	const { whereClause, whereValues } = buildIssueFilters({ userId, status, priority, search });

	const [rows] = await pool.query(
		`SELECT id, title, description, status, priority, user_id, created_at, updated_at
		 FROM issues
		 ${whereClause}
		 ORDER BY created_at DESC`,
		whereValues
	);

	return rows;
};

const getIssueById = async ({ id, userId }) => {
	const [rows] = await pool.query(
		'SELECT id, title, description, status, priority, user_id, created_at, updated_at FROM issues WHERE id = ? AND user_id = ?',
		[id, userId]
	);
	return rows[0] || null;
};

const updateIssueById = async ({ id, userId, payload }) => {
	const fields = Object.keys(payload);
	if (!fields.length) {
		return getIssueById({ id, userId });
	}

	const setClause = fields.map((field) => `${field} = ?`).join(', ');
	const values = fields.map((field) => payload[field]);

	await pool.query(`UPDATE issues SET ${setClause} WHERE id = ? AND user_id = ?`, [...values, id, userId]);
	return getIssueById({ id, userId });
};

const deleteIssueById = async ({ id, userId }) => {
	const [result] = await pool.query('DELETE FROM issues WHERE id = ? AND user_id = ?', [id, userId]);
	return result.affectedRows > 0;
};

const updateIssueStatus = async ({ id, userId, status }) => {
	await pool.query('UPDATE issues SET status = ? WHERE id = ? AND user_id = ?', [status, id, userId]);
	return getIssueById({ id, userId });
};

module.exports = {
	createIssue,
	getIssues,
	getIssuesForExport,
	getIssueById,
	updateIssueById,
	deleteIssueById,
	updateIssueStatus
};

