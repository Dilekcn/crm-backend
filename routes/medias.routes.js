const express = require('express');
const router = express.Router();

const mediasControllers = require('../controllers/medias.controllers')

router.get('/medias', mediasControllers.getAllMedia)
router.get('/medias/:movieId', mediasControllers.getSingleMedia)
router.post('/medias', mediasControllers.createMedia)
router.put('/medias/:movieId', mediasControllers.updateSingleMedia)
router.delete('/medias/:movieId', mediasControllers.removeSingleMedia)


module.exports = router