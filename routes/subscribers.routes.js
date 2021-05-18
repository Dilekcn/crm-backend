const express = require('express')
const router = express.Router()
const subscribesControllers = require('../controllers/subscribers.controllers')

router.get('/subscribers', subscribesControllers.getAll)
router.post('/subscribers', subscribesControllers.create)
router.delete('/subscribers/:id', subscribesControllers.delete)

module.exports = router