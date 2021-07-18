var express = require('express');
var router = express.Router();

const componentsControllers = require('../controllers/components.controllers');

router.get('/components', componentsControllers.getAll);
router.get('/components/:id', componentsControllers.getSingleComponent);
router.post('/components', componentsControllers.create);
router.put('/components/:id', componentsControllers.updateComponent);
router.delete('/components/:id', componentsControllers.removeSingleComponent);

module.exports = router;
 