const express  =require('express');
const router = express.Router();

const SocialMediaController = require('../controllers/socialMedia.controllers');


router.get('/socialMedia', SocialMediaController.getAllSocialMedia);
router.post('/socialMedia', SocialMediaController.createSocialMedia);
// router.put('/socialMedia/:socialMediaId', socialMediaController.updateSocialMedia);
// router.delete('/socialMedia/:socialMediaId', socialMediaController.removeSocialMedia);

module.exports = router;