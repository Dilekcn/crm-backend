var express = require('express');
var router = express.Router();

const messagesControllers = require('../controllers/messages.controllers');
 
router.get("/messages",messagesControllers.getAll)
router.get("/messages/:id",messagesControllers.getSingleMessage)
router.get("/messages/subject/:subject",messagesControllers.getMessageBySubject)
router.post("/messages",messagesControllers.create)
router.put("/messages/:id", messagesControllers.updateMessage)
router.delete("/messages/:id", messagesControllers.removeSingleMessage)

module.exports = router; 

