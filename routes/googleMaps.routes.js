const express = require('express')
const router = express.Router()
const googleMapsControllers = require('../controllers/googleMaps.controllers')

router.get('/googlemaps', googleMapsControllers.getAll)
router.post('/googlemaps', googleMapsControllers.createFooter)
router.put('/googlemaps', googleMapsControllers.updateFooterById)
router.delete('/googlemaps', googleMapsControllers.removeFooterById)

module.exports = router