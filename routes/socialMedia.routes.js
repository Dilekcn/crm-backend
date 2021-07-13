const express = require('express');
const router = express.Router();

const SocialMediaController = require('../controllers/socialMedia.controllers');

router.get('/socialmedia', SocialMediaController.getAllSocialMedia);
router.post('/socialmedia', SocialMediaController.createSocialMedia);
router.put('/socialmedia/:socialmediaid', SocialMediaController.updateSocialMedia);
router.delete('/socialmedia/:socialmediaid', SocialMediaController.removeSocialMedia);

module.exports = router;
