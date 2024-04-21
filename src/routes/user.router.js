const express = require('express');
const { index, create, show, destroy, update, verifyCode } = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.route('/')
    .get(index)
    .post(create);

userRouter.route('/verify/:code')
    .get(verifyCode);

userRouter.route('/:id')
    .get(show)
    .delete(destroy)
    .put(update);

module.exports = userRouter;