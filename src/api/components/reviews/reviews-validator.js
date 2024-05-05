const joi = require('joi');

module.exports = {
  createReview: {
    body: {
      product_name: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Product Name'),
      review: joi.string().min(1).max(100).required().label('Review'),
      star: joi.number().integer().min(1).max(5).required().label('Star'),
    },
  },

  updateReview: {
    body: {
      product_name: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Product Name'),
      review: joi.string().min(1).max(100).required().label('Review'),
      star: joi.number().integer().min(1).max(5).required().label('Star'),
    },
  },
};
