const express = require('express');
const router = express.Router();
const googleMapsControllers = require('../controllers/googleMaps.controllers');

router.get('/googlemaps', googleMapsControllers.getAll);
router.post('/googlemaps', googleMapsControllers.createGoogleMaps);
router.put('/googlemaps', googleMapsControllers.updateGoogleMapsById);
router.delete('/googlemaps', googleMapsControllers.removeGoogleMapsById);

module.exports = router;
