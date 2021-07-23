var express = require('express');
var router = express.Router();

const sectionsControllers = require('../controllers/sections.controllers');

router.get('/sections', sectionsControllers.getAll);
router.get('/sections/:id', sectionsControllers.getSingleSection);
router.get('/sections/sectype/:secType', sectionsControllers.getSingleSectionByType);
router.post('/sections', sectionsControllers.create);
router.put('/sections/:id', sectionsControllers.updateSection);
router.delete('/sections/:id', sectionsControllers.removeSingleSection);

module.exports = router; 
 