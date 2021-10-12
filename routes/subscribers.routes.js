const express = require('express');
const router = express.Router();
const subscribersControllers = require('../controllers/subscribers.controllers');

router.get('/subscribers', subscribersControllers.getAll);
router.get('/subscribers/:id', subscribersControllers.getSingleSubscriber);
router.post('/subscribers', subscribersControllers.create);
router.post('/subscribers/filter', subscribersControllers.getWithQuery);
router.post('/subscribers/search', subscribersControllers.searchSubscribers);
router.put('/subscribers/:id', subscribersControllers.updateSubscriber);
router.delete('/subscribers/:id', subscribersControllers.delete);

module.exports = router;
