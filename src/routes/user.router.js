const express = require('express');
const { index, create, show, destroy, update } = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.route('/')
    .get(index)
    .post(create);

userRouter.route('/:id')
    .get(show)
    .delete(destroy)
    .put(update);

module.exports = userRouter;