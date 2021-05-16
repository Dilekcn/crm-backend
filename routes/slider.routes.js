const express = require('express');
const router = express.Router();

const SliderController = require('../controllers/slider.controller');

router.get('/slider', SliderController.getAllSlides);
router.get('/slider/:slideid', SliderController.getSingleSlide);
router.get('/slider/title/:titletext', SliderController.getSingleSlideByTitle);
router.post('/slider', SliderController.createSlide);
router.put('/slider/:slideid', SliderController.updateSlider);

module.exports = router;
