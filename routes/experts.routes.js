const express = require('express');
const router = express.Router();

const ExpertsController = require('../controllers/experts.controllers');

router.get('/experts', ExpertsController.getAllExperts);

module.exports = router;
