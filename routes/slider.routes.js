const express = require('express');
const router = express.Router();

const SliderController = require('../controllers/slider.controller');

router.get('/slider', SliderController.getAllSlides);
router.post('/slider', SliderController.createSlide);

module.exports = router;
