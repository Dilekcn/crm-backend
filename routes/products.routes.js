const express = require('express');
const router = express.Router();

const productsControllers = require('../controllers/products.controllers')

router.get('/products',productsControllers.getAllProduct)
router.post('/products', productsControllers.createProduct)


module.exports = router