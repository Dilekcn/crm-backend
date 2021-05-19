const express = require('express');
const router = express.Router();

const RolesController = require('../controllers/roles.controllers');

router.get('/roles', RolesController.getAllRoles);

module.exports = router;
