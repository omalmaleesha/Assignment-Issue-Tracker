const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const apiRoutes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');
const swaggerSpec = require('./docs/swagger');

const app = express();

// Common middleware stack
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
	res.status(200).json({ message: 'Issue Tracker API is running' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', apiRoutes);

// Centralized not found + error handlers (keep these last)
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

