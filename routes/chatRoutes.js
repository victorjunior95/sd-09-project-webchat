const { Router } = require('express');

const user = require('../controllers/chatControllers');

const router = Router();

router.route('/').get(user);

module.exports = router;