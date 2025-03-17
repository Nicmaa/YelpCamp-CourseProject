const express = require('express');
const router = express.Router();
const multer = require('multer');

const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utilities/catchAsync');
const validateObjectId = require('../utilities/validateObjectId');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(validateObjectId, catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateObjectId, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, validateObjectId, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, validateObjectId, catchAsync(campgrounds.renderEditForm));

module.exports = router;
