const express = require('express');
const router = express.Router();

const staticPageControllers = require('../controllers/staticPage.controllers');

router.get('/staticpage', staticPageControllers.getAll);
router.get('/staticpage/:id', staticPageControllers.getSinglePage);
router.get('/staticpage/name/:name', staticPageControllers.getSinglePageByName);
router.post('/staticpage', staticPageControllers.createPage);
router.post('/staticpage/filter', staticPageControllers.getWithQuery);
router.put('/staticpage/:id', staticPageControllers.updatePages);
router.delete('/staticpage/:id', staticPageControllers.removePage);

module.exports = router;
