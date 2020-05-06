const express = require('express')
const {body} = require('express-validator/check')

const router = express.Router();

const feedController = require('../controllers/feed');

router.get('/posts', feedController.getPost);
router.post('/posts', [
    body('title')
    .trim()
    .isLength({min: 5}),
    body('content')
    .trim()
    .isLength({min: 5})
] ,feedController.addPost);

module.exports = router