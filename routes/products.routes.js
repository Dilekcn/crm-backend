const express = require('express');
const router = express.Router();

const productsControllers = require('../controllers/products.controllers');

router.get('/products', productsControllers.getAllProducts);
router.get('/products/:productid', productsControllers.getSingleProduct);
router.post('/products', productsControllers.createProduct);
router.put('/products/:productid', productsControllers.updateSingleProduct);
router.delete('/products/:productid', productsControllers.deleteProduct);

module.exports = router;
