const express = require('express');
const router = express.Router();

const parentMenuControllers = require('../controllers/parentMenu.controllers')

router.get('/parentMenu',parentMenuControllers.getAllParentMenu)
router.post('/parentMenu', parentMenuControllers.createParentMenu)
router.put('/parentMenu/:parentMenuId', parentMenuControllers.updateSingleParentMenu)
router.delete('/parentMenu/:parentMenuId', parentMenuControllers.deleteParentMenu)



module.exports = router