const express = require('express');
const router = express.Router();

const productsControllers = require('../controllers/products.controllers');

router.get('/products', productsControllers.getAllProducts);
router.get('/products/:productid', productsControllers.getSingleProduct);
router.get('/products/userid/:userid', productsControllers.getProductsByUserId);
router.get('/products/title/:title', productsControllers.getProductsByTitle);
router.post('/products', productsControllers.createProduct);
router.post('/products/filter', productsControllers.getWithQuery);
router.post('/products/search', productsControllers.searchProducts);
router.put('/products/:productid', productsControllers.updateSingleProduct);
router.delete('/products/:productid', productsControllers.deleteProduct);

module.exports = router;
