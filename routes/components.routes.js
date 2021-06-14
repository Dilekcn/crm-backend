const express = require('express');
const router = express.Router();

const ComponentController = require('../controllers/components.controllers');

router.get('/components', ComponentController.getAllComponents);
router.get('/components/:componentid', ComponentController.getSingleComponent);
router.get('/components/componentname/:componentname', ComponentController.getComponentByName);
router.get('/components/componentid/:componentid', ComponentController.getComponentByComponentId);
router.post('/components', ComponentController.createComponent);
router.put('/components/:componentid', ComponentController.updateComponent);

module.exports = router;
