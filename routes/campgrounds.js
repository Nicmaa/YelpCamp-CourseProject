const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utilities/catchAsync');
const validateObjectId = require('../utilities/validateObjectId');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(validateObjectId, catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateObjectId, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, validateObjectId, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, validateObjectId, catchAsync(campgrounds.renderEditForm));

module.exports = router;
