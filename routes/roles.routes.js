const express = require('express');
const router = express.Router();

const RolesController = require('../controllers/roles.controllers');

router.get('/roles', RolesController.getAllRoles);
router.get('/roles/:roleid', RolesController.getSingleRole);
router.post('/roles', RolesController.createRole);
router.put('/roles/:roleid', RolesController.updateRole);
router.delete('/roles/:roleid', RolesController.removeRole);

module.exports = router;
