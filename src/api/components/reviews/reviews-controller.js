const reviewsService = require('./reviews-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getReviews(request, response, next) {
  try {
    const { page_number = 1, page_size = 10, sort, search } = request.query;
    const reviews = await reviewsService.getReviews(
      sort,
      search,
      Number(page_number),
      Number(page_size)
    );
    return response.status(200).json(reviews);
  } catch (error) {
    return next(error);
  }
}

async function getReview(request, response, next) {
  try {
    const review = await reviewsService.getReview(request.params.id);

    if (!review) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'UNPROCESSABLE REVIEW'
      );
    }

    return response.status(200).json(review);
  } catch (error) {
    return next(error);
  }
}

async function createReview(request, response, next) {
  try {
    const product_name = request.body.product_name;
    const review = request.body.review;
    const star = request.body.star;

    const success = await reviewsService.createReview(
      product_name,
      review,
      star
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create Review'
      );
    }

    return response.status(200).json({ product_name, review, star });
  } catch (error) {
    return next(error);
  }
}

async function updateReview(request, response, next) {
  try {
    const id = request.params.id;
    const product_name = request.body.product_name;
    const review = request.body.review;
    const star = request.body.star;

    const success = await reviewsService.updateReview(
      id,
      product_name,
      review,
      star
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update Review'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function deleteReview(request, response, next) {
  try {
    const id = request.params.id;

    const success = await reviewsService.deleteReview(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete review'
      );
    }
    return response
      .status(200)
      .json({ message: 'Review deleted successfully' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
