const { Review } = require('../../../models');

async function getReviews() {
  return Review.find({});
}

async function getReview(id) {
  return Review.findById(id);
}

async function createReview(product_name, review, star) {
  return Review.create({ product_name, review, star });
}

async function updateReview(id, product_name, review, star) {
  return Review.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        product_name,
        review,
        star,
      },
    }
  );
}

async function deleteReview(id) {
  return Review.deleteOne({ _id: id });
}

module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
