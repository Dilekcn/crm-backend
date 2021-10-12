const express = require('express');
const router = express.Router();

const companyIntroductionControllers = require('../controllers/companyIntroduction.controllers');

router.get('/companyintroduction', companyIntroductionControllers.getAll);
router.get(
	'/companyintroduction/:id',
	companyIntroductionControllers.getSingleIntroduction
);
router.get(
	'/companyintroduction/title/:title',
	companyIntroductionControllers.getSingleIntroductionByTitle
);
router.post('/companyintroduction/filter', companyIntroductionControllers.getWithQuery);
router.post('/companyintroduction/search', companyIntroductionControllers.searchCompanyIntroductions);

router.post('/companyintroduction', companyIntroductionControllers.createIntroduction);
router.put(
	'/companyintroduction/:id', 
	companyIntroductionControllers.updateIntroductions
);
router.delete(
	'/companyintroduction/:id',
	companyIntroductionControllers.removeIntroduction
);

module.exports = router;
