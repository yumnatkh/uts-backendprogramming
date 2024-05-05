const reviewsRepository = require('./reviews-repository');

async function getReviews(sort, search, page_number = 1, page_size = 10) {
  let reviews = await reviewsRepository.getReviews();
  if (sort && typeof sort === 'string') {
    const sortParts = sort.split(':');
    if (sortParts.length === 2) {
      const [field, order] = sortParts;
      if (['product_name'].includes(field) && ['asc', 'desc'].includes(order)) {
        reviews.sort((a, b) => {
          if (order === 'asc') {
            return a[field].localeCompare(b[field]);
          } else {
            return b[field].localeCompare(a[field]);
          }
        });
      }
    }
  }

  if (search && typeof search === 'string') {
    const searchParts = search.split(':');
    if (searchParts.length === 2) {
      const [searchField, searchTerm] = searchParts;
      const normalizedSearchTerm = searchTerm.toLowerCase();
      reviews = reviews.filter((review) =>
        review[searchField].toLowerCase().includes(normalizedSearchTerm)
      );
    }
  }
  const totalItems = reviews.length;
  const totalPages = Math.ceil(totalItems / page_size);
  const startIndex = (page_number - 1) * page_size;
  const endIndex = Math.min(startIndex + page_size, totalItems);
  const paginatedResults = reviews.slice(startIndex, endIndex);
  const results = paginatedResults.map((review) => ({
    id: review._id,
    product_name: review.product_name,
    review: review.review,
    star: review.star,
  }));

  return {
    page_number: page_number,
    page_size: page_size,
    count: results.length,
    total_pages: totalPages,
    has_previous_page: page_number > 1,
    has_next_page: endIndex < totalItems,
    data: results,
  };
}

async function getReview(id) {
  const review = await reviewsRepository.getReview(id);
  if (!review) {
    return null;
  }
  return {
    product_name: review.product_name,
    review: review.review,
    star: review.star,
  };
}

async function createReview(product_name, review, star) {
  try {
    await reviewsRepository.createReview(product_name, review, star);
  } catch (err) {
    return null;
  }

  return true;
}

async function updateReview(id, product_name, review, star) {
  const reviewUpdate = await reviewsRepository.getReview(id);
  if (!reviewUpdate) {
    return null;
  }

  try {
    await reviewsRepository.updateReview(id, product_name, review, star);
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteReview(id) {
  const review = await reviewsRepository.getReview(id);
  if (!review) {
    return null;
  }
  try {
    await reviewsRepository.deleteReview(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
