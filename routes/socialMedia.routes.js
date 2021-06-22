const express  =require('express');
const router = express.Router();

const SocialMediaController = require('../controllers/socialMedia.controllers');


router.get('/socialMedia', SocialMediaController.getAllSocialMedia);
router.post('/socialMedia', SocialMediaController.createSocialMedia);
 router.put('/socialMedia/:socialMediaId', SocialMediaController.updateSocialMedia);
 router.delete('/socialMedia/:socialMediaId', SocialMediaController.removeSocialMedia);

module.exports = router;