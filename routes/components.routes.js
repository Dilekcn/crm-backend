const express = require('express');
const router = express.Router();

const ComponentController = require('../controllers/components.controllers');

router.get('/components', ComponentController.getAllComponents);
router.get('/components/:componentid', ComponentController.getSingleComponent);
router.get('/components/componentname/:componentname', ComponentController.getComponentByName);
router.post('/components', ComponentController.createComponent);

module.exports = router;
