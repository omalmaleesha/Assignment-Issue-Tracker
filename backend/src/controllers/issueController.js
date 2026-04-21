const {
	createIssue,
	getIssues,
	getIssuesForExport,
	getIssueById,
	updateIssueById,
	deleteIssueById,
	updateIssueStatus
} = require('../models/issueModel');
const ApiError = require('../utils/ApiError');

const createIssueHandler = async (req, res, next) => {
	try {
		const issue = await createIssue({
			...req.body,
			userId: req.user.id
		});

		return res.status(201).json({
			success: true,
			message: 'Issue created successfully',
			data: issue
		});
	} catch (error) {
		return next(error);
	}
};

const getIssuesHandler = async (req, res, next) => {
	try {
		const { page, limit, status, priority, search } = req.query;

		const result = await getIssues({
			userId: req.user.id,
			page: Number(page),
			limit: Number(limit),
			status,
			priority,
			search
		});

		return res.status(200).json({
			success: true,
			message: 'Issues fetched successfully',
			data: result.data,
			pagination: result.pagination
		});
	} catch (error) {
		return next(error);
	}
};

const downloadIssuesJsonHandler = async (req, res, next) => {
	try {
		const { status, priority, search } = req.query;
		const issues = await getIssuesForExport({
			userId: req.user.id,
			status,
			priority,
			search
		});

		const payload = {
			success: true,
			message: 'Issues exported successfully',
			exportedAt: new Date().toISOString(),
			count: issues.length,
			data: issues
		};

		const fileName = `issues-export-${Date.now()}.json`;
		res.setHeader('Content-Type', 'application/json; charset=utf-8');
		res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

		return res.status(200).send(JSON.stringify(payload, null, 2));
	} catch (error) {
		return next(error);
	}
};

const getIssueByIdHandler = async (req, res, next) => {
	try {
		const issue = await getIssueById({ id: Number(req.params.id), userId: req.user.id });
		if (!issue) {
			throw new ApiError(404, 'Issue not found');
		}

		return res.status(200).json({
			success: true,
			message: 'Issue fetched successfully',
			data: issue
		});
	} catch (error) {
		return next(error);
	}
};

const updateIssueHandler = async (req, res, next) => {
	try {
		const existingIssue = await getIssueById({ id: Number(req.params.id), userId: req.user.id });
		if (!existingIssue) {
			throw new ApiError(404, 'Issue not found');
		}

		const updatedIssue = await updateIssueById({
			id: Number(req.params.id),
			userId: req.user.id,
			payload: req.body
		});

		return res.status(200).json({
			success: true,
			message: 'Issue updated successfully',
			data: updatedIssue
		});
	} catch (error) {
		return next(error);
	}
};

const deleteIssueHandler = async (req, res, next) => {
	try {
		const deleted = await deleteIssueById({ id: Number(req.params.id), userId: req.user.id });
		if (!deleted) {
			throw new ApiError(404, 'Issue not found');
		}

		return res.status(200).json({
			success: true,
			message: 'Issue deleted successfully'
		});
	} catch (error) {
		return next(error);
	}
};

const updateIssueStatusHandler = async (req, res, next) => {
	try {
		const issue = await getIssueById({ id: Number(req.params.id), userId: req.user.id });
		if (!issue) {
			throw new ApiError(404, 'Issue not found');
		}

		const updatedIssue = await updateIssueStatus({
			id: Number(req.params.id),
			userId: req.user.id,
			status: req.body.status
		});

		return res.status(200).json({
			success: true,
			message: 'Issue status updated successfully',
			data: updatedIssue
		});
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	createIssueHandler,
	getIssuesHandler,
	downloadIssuesJsonHandler,
	getIssueByIdHandler,
	updateIssueHandler,
	deleteIssueHandler,
	updateIssueStatusHandler
};

