const express = require('express');
const router = express.Router();
const { recordCheckout, getCheckouts } = require('../controllers/checkoutController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, recordCheckout);
router.get('/history', auth, getCheckouts);

module.exports = router;
