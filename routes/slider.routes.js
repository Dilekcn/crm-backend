const express = require('express');
const router = express.Router();

const SliderController = require('../controllers/slider.controller');

router.get('/slider', SliderController.getAllSlides);
router.get('/slider/:slideid', SliderController.getSingleSlide);
router.get('/slider/title/:titletext', SliderController.getSingleSlideByTitle);
router.post('/slider', SliderController.createSlide);
router.post('/slider/filter', SliderController.getWithQuery);
router.post('/slider/search', SliderController.searchSliders);
router.put('/slider/:slideid', SliderController.updateSlider);
router.delete('/slider/:slideid', SliderController.removeSlide);

module.exports = router;
