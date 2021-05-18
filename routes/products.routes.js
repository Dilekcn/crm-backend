const express = require('express');
const router = express.Router();

const productsControllers = require('../controllers/products.controllers')

router.get('/products',productsControllers.getAllProduct)
router.post('/products', productsControllers.createProduct)



// router.get('/medias', mediasControllers.getAllMedia)
// router.get('/medias/:movieId', mediasControllers.getSingleMedia)

// router.put('/medias/:movieId', mediasControllers.updateSingleMedia)
// router.delete('/medias/:movieId', mediasControllers.removeSingleMedia)


module.exports = router