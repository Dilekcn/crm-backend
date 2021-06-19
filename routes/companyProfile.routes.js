const express = require('express');
const router = express.Router();

const CompanyProfileControllers = require('../controllers/companyProfile.controllers');

router.get('/companyprofile', CompanyProfileControllers.getAll);
router.get('/companyprofile/:id', CompanyProfileControllers.getSingle);
router.post('/companyprofile', CompanyProfileControllers.create);
router.post('/companyprofile/:id', CompanyProfileControllers.update);
router.post('/companyprofile/:id', CompanyProfileControllers.delete);

module.exports = router;
