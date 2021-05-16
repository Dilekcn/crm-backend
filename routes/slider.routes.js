const express = require('express');
const router = express.Router();

const SliderController = require('../controllers/slider.controller');

router.get('/slider', SliderController.getAll);

module.exports = router;
