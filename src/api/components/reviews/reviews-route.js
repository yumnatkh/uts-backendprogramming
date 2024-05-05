const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const reviewsControllers = require('./reviews-controller');
const reviewsValidator = require('./reviews-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/reviews', route);

  route.get('/', authenticationMiddleware, reviewsControllers.getReviews);

  route.post(
    '/',
    authenticationMiddleware,
    celebrate(reviewsValidator.createReview),
    reviewsControllers.createReview
  );

  route.get('/:id', authenticationMiddleware, reviewsControllers.getReview);

  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(reviewsValidator.updateReview),
    reviewsControllers.updateReview
  );

  route.delete(
    '/:id',
    authenticationMiddleware,
    reviewsControllers.deleteReview
  );
};
