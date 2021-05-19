const express = require('express');
const router = express.Router();

const ExpertsController = require('../controllers/experts.controllers');

router.get('/experts', ExpertsController.getAllExperts);
router.get('/experts', ExpertsController.getSingleExpert);
router.get(	'/experts/firstname/:firstname',	ExpertsController.getExpertsByFirstname,);
router.get(	'/experts/lastname/:lastname',	ExpertsController.getExpertsByLastname,);
router.get(	'/experts/expertise/:expertise',	ExpertsController.getExpertsByExpertise,);
router.post('/experts', ExpertsController.createExpert);
router.put('/experts/:expertid', ExpertsController.updateExpert);
router.delete('/experts/:expertid', ExpertsController.removeExpert);

module.exports = router;
