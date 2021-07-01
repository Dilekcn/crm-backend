var express = require('express');
var router = express.Router();

const iconBoxControllers = require('../controllers/iconBox.controllers');

router.get('/iconbox', iconBoxControllers.getAll);
router.get('/iconbox/:id', iconBoxControllers.getSingleIconBox);
router.get('/iconbox/title/:title', iconBoxControllers.getIconBoxByTitle);
router.get('/iconbox/author/:author', iconBoxControllers.getIconBoxByAuthor);
router.post('/iconbox', iconBoxControllers.create);
router.put('/iconbox/:id', iconBoxControllers.updateIconBox);
router.delete('/iconbox/:id', iconBoxControllers.removeSingleIconBox);

module.exports = router;
