const express = require('express');
const router = express.Router();

const CompanyProfileControllers = require('../controllers/companyProfile.controllers');

router.get('/companyprofile', CompanyProfileControllers.getAll);
router.get('/companyprofile/:id', CompanyProfileControllers.getSingle);
router.post('/companyprofile', CompanyProfileControllers.create);
router.put('/companyprofile/:id', CompanyProfileControllers.update);
router.delete('/companyprofile/:id', CompanyProfileControllers.delete);

module.exports = router;
