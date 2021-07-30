const express = require('express');
const router = express.Router();
const googleMapsControllers = require('../controllers/googleMaps.controllers');

router.get('/googlemaps', googleMapsControllers.getAll);
router.get('/googlemaps/:id', googleMapsControllers.getSingleGoogleMapById);
router.post('/googlemaps', googleMapsControllers.createGoogleMaps);
router.put('/googlemaps/:id', googleMapsControllers.updateGoogleMapsById);
router.delete('/googlemaps/:id', googleMapsControllers.removeGoogleMapsById);

module.exports = router;
