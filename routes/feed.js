const express = require('express')

const router = express.Router();

const feedController = require('../controllers/feed');

router.get('/posts', feedController.getPost);
router.post('/posts', feedController.addPost);

module.exports = router