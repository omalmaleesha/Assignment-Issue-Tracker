const mysql = require('mysql2/promise');

const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;
`;

const createIssuesTableQuery = `
  CREATE TABLE IF NOT EXISTS issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') NOT NULL DEFAULT 'Open',
    priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_issues_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB;
`;

const ensureIndex = async (connection, tableName, indexName, createQuery) => {
  const [rows] = await connection.query(
    `
      SELECT 1
      FROM information_schema.statistics
      WHERE table_schema = ? AND table_name = ? AND index_name = ?
      LIMIT 1
    `,
    [process.env.DB_NAME, tableName, indexName]
  );

  if (!rows.length) {
    await connection.query(createQuery);
  }
};

const initializeDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  try {
    // 1) Ensure database exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);

    // 2) Select the database and ensure required tables exist
    await connection.query(`USE \`${process.env.DB_NAME}\``);
    await connection.query(createUsersTableQuery);
    await connection.query(createIssuesTableQuery);

    // 3) Ensure required indexes exist
    await ensureIndex(
      connection,
      'issues',
      'idx_issues_user_id',
      'CREATE INDEX idx_issues_user_id ON issues(user_id)'
    );
    await ensureIndex(
      connection,
      'issues',
      'idx_issues_status',
      'CREATE INDEX idx_issues_status ON issues(status)'
    );
    await ensureIndex(
      connection,
      'issues',
      'idx_issues_priority',
      'CREATE INDEX idx_issues_priority ON issues(priority)'
    );
    await ensureIndex(
      connection,
      'issues',
      'idx_issues_title',
      'CREATE INDEX idx_issues_title ON issues(title)'
    );
  } finally {
    await connection.end();
  }
};

module.exports = {
  initializeDatabase
};
