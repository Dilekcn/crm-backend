const express = require('express');
const router = express.Router();
const subscribersControllers = require('../controllers/subscribers.controllers');

router.get('/subscribers', subscribersControllers.getAll);
router.post('/subscribers', subscribersControllers.create);
router.post('/subscribers/filter', subscribersControllers.getWithQuery);
router.delete('/subscribers/:id', subscribersControllers.delete);

module.exports = router;
