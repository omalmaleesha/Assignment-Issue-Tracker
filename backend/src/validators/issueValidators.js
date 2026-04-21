const Joi = require('joi');

const issueStatus = ['Open', 'In Progress', 'Resolved', 'Closed'];
const issuePriority = ['Low', 'Medium', 'High'];

const createIssueSchema = Joi.object({
	title: Joi.string().min(3).max(150).required(),
	description: Joi.string().min(3).max(5000).required(),
	status: Joi.string()
		.valid(...issueStatus)
		.default('Open'),
	priority: Joi.string()
		.valid(...issuePriority)
		.default('Medium')
});

const updateIssueSchema = Joi.object({
	title: Joi.string().min(3).max(150),
	description: Joi.string().min(3).max(5000),
	status: Joi.string().valid(...issueStatus),
	priority: Joi.string().valid(...issuePriority)
}).min(1);

const updateStatusSchema = Joi.object({
	status: Joi.string().valid('Resolved', 'Closed').required()
});

const issueParamsSchema = Joi.object({
	id: Joi.number().integer().positive().required()
});

const issueListQuerySchema = Joi.object({
	page: Joi.number().integer().min(1).default(1),
	limit: Joi.number().integer().min(1).max(100).default(10),
	status: Joi.string().valid(...issueStatus),
	priority: Joi.string().valid(...issuePriority),
	search: Joi.string().allow('').max(150)
});

const issueExportQuerySchema = Joi.object({
	status: Joi.string().valid(...issueStatus),
	priority: Joi.string().valid(...issuePriority),
	search: Joi.string().allow('').max(150)
});

module.exports = {
	createIssueSchema,
	updateIssueSchema,
	updateStatusSchema,
	issueParamsSchema,
	issueListQuerySchema,
	issueExportQuerySchema
};

