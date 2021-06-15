const express = require('express');
const router = express.Router();

const ComponentController = require('../controllers/components.controllers');

router.get('/components', ComponentController.getAllComponents);
router.get('/components/:componentid', ComponentController.getSingleComponent);
router.get('/components/componentname/:componentname', ComponentController.getComponentByName);
router.get('/components/componentId/:componentId', ComponentController.getComponentByComponentId);
router.post('/components', ComponentController.createComponent);
router.put('/components/:componentid', ComponentController.updateComponent);
router.delete('/components/:componentid', ComponentController.removeComponent);

module.exports = router;
