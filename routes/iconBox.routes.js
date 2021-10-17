var express = require('express');
var router = express.Router();

const iconBoxControllers = require('../controllers/iconBox.controllers');

router.get('/iconbox', iconBoxControllers.getAll);
router.get('/iconbox/:id', iconBoxControllers.getSingleIconBox);
router.post('/iconbox', iconBoxControllers.create);
router.post('/iconbox/filter', iconBoxControllers.getWithQuery);
router.post('/iconbox/search', iconBoxControllers.searchIconBox); 
router.put('/iconbox/:id', iconBoxControllers.updateIconBox);
router.delete('/iconbox/:id', iconBoxControllers.removeSingleIconBox);

module.exports = router;
 