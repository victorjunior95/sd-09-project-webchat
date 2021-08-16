const { Router } = require('express');

const chat = require('../controllers/chatControllers');

const router = Router();

router.route('/').get(chat.getUsers);

module.exports = router;