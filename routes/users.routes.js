const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users.controllers');
const isAdmin = require('../auth/isAdmin');

router.get('/users', userControllers.getAllUsers);
router.post('/users', userControllers.createUser);
router.post('/users/login', userControllers.login);
router.put('/users/:id', userControllers.updateUser);
router.delete('/users/:id', userControllers.deleteUser);

module.exports = router;
