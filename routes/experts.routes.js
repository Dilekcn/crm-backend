const express = require('express');
const router = express.Router();

const ExpertsController = require('../controllers/experts.controllers');

router.get('/experts', ExpertsController.getAllExperts);
router.get('/experts/:expertid', ExpertsController.getSingleExpert);
router.post('/experts/filter', ExpertsController.getWithQuery);
router.post('/experts/search', ExpertsController.searchExperts);
router.post('/experts', ExpertsController.createExpert);
router.put('/experts/:expertid', ExpertsController.updateExpert);
router.delete('/experts/:expertid', ExpertsController.removeExpert); 

module.exports = router;
 