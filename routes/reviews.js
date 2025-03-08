const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews')
const validateObjectId = require('../utilities/validateObjectId');
const catchAsync = require('../utilities/catchAsync');

const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:revId', isLoggedIn, isReviewAuthor, validateObjectId, catchAsync(reviews.deleteReview));

module.exports = router;
