const express = require('express');
const router = express.Router();

const mediasControllers = require('../controllers/medias.controllers')

router.get('/medias', mediasControllers.getAllMedia)
router.get('/medias/:mediaId', mediasControllers.getSingleMedia)
router.get('/medias/title/:title', mediasControllers.getSingleMediaByTitle)
router.post('/medias', mediasControllers.createMedia)
router.put('/medias/:mediaId', mediasControllers.updateSingleMedia)
router.delete('/medias/:mediaId', mediasControllers.removeSingleMedia)


module.exports = router