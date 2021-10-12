var express = require('express');
var router = express.Router();

const messagesControllers = require('../controllers/messages.controllers');

router.get('/messages', messagesControllers.getAll);
router.get('/messages/:id', messagesControllers.getSingleMessage);
router.get('/messages/subject/:subject', messagesControllers.getMessagesBySubject);
router.get('/messages/email/:email', messagesControllers.getMessagesByEmail);
router.post('/messages', messagesControllers.create);
router.post('/messages/filter', messagesControllers.getWithQuery);
router.post('/messages/search', messagesControllers.searchMessages);
router.put('/messages/:id', messagesControllers.updateMessage);
router.delete('/messages/:id', messagesControllers.removeSingleMessage);

module.exports = router;
