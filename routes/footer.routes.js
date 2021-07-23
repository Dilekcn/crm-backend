const express = require('express');
const router = express.Router();
const footerControllers = require('../controllers/footer.controllers');

router.get('/footer', footerControllers.getAll);
router.get('/footer/:id', footerControllers.getSingleFooterById);
router.post('/footer', footerControllers.createFooter);
router.put('/footer/:id', footerControllers.updateFooterById);
router.delete('/footer/:id', footerControllers.removeFooterById);

module.exports = router;
