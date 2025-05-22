const express = require('express');
const router = express.Router();
const { createUser, listUsers } = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, createUser);
router.get('/', auth, listUsers);

module.exports = router;
