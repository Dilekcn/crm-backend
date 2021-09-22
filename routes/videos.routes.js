const express = require('express');
const router = express.Router();

const videosControllers = require('../controllers/videos.controllers');

router.get('/videos', videosControllers.getAllVideo);
router.get('/videos/:videoid', videosControllers.getSingleVideo);
router.post('/videos', videosControllers.createVideo);
router.post('/videos/filter', videosControllers.getWithQuery);
router.put('/videos/:videoid', videosControllers.updateSingleVideo);
router.delete('/videos/:videoid', videosControllers.removeSingleVideo);

module.exports = router;
 