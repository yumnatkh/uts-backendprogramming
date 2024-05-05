const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const reviews = require('./components/reviews/reviews-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  reviews(app);

  return app;
};
