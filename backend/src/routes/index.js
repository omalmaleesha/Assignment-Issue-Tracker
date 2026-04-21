const express = require('express');

const authRoutes = require('./authRoutes');
const issueRoutes = require('./issueRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/issues', issueRoutes);

module.exports = router;

