const express = require('express');
const router = express.Router();

const ExpertsController = require('../controllers/experts.controllers');

router.get('/experts', ExpertsController.getAllExperts);
router.get('/experts', ExpertsController.getSingleExpert);
router.get('/experts/:firstname', ExpertsController.getExpertsByFirstname);
router.post('/experts', ExpertsController.createExpert);

module.exports = router;
