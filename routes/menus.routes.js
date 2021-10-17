var express = require('express');
var router = express.Router();

const menusControllers = require('../controllers/menus.controllers');

router.get('/menus', menusControllers.getAll);
router.get('/menus/:id', menusControllers.getSingleMenu);
router.get('/menus/parentid/:parentid', menusControllers.getMenuByParentId);
router.post('/menus', menusControllers.create);
router.post('/menus/filter', menusControllers.getWithQuery);
router.post('/menus/search', menusControllers.searchMenus);
router.put('/menus/:id', menusControllers.updateMenu);
router.delete('/menus/:id', menusControllers.removeSingleMenu);

module.exports = router;
 