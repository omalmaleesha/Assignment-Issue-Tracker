const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
	createIssueSchema,
	updateIssueSchema,
	updateStatusSchema,
	issueParamsSchema,
	issueListQuerySchema,
	issueExportQuerySchema
} = require('../validators/issueValidators');
const {
	createIssueHandler,
	getIssuesHandler,
	downloadIssuesJsonHandler,
	getIssueByIdHandler,
	updateIssueHandler,
	deleteIssueHandler,
	updateIssueStatusHandler
} = require('../controllers/issueController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', validateRequest(createIssueSchema), createIssueHandler);
router.get('/', validateRequest(issueListQuerySchema, 'query'), getIssuesHandler);
router.get('/export/json', validateRequest(issueExportQuerySchema, 'query'), downloadIssuesJsonHandler);
router.get('/:id', validateRequest(issueParamsSchema, 'params'), getIssueByIdHandler);
router.put(
	'/:id',
	validateRequest(issueParamsSchema, 'params'),
	validateRequest(updateIssueSchema),
	updateIssueHandler
);
router.delete('/:id', validateRequest(issueParamsSchema, 'params'), deleteIssueHandler);
router.patch(
	'/:id/status',
	validateRequest(issueParamsSchema, 'params'),
	validateRequest(updateStatusSchema),
	updateIssueStatusHandler
);

module.exports = router;

