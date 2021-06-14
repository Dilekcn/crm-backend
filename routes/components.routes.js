const express = require('express');
const router = express.Router();

const ComponentController = require('../controllers/components.controllers');

router.get('/components', ComponentController.getAllComponents);
router.post('/components', ComponentController.createComponent);

module.exports = router;
