const express = require('express');
const router = express.Router({ mergeParams: true });

const validateObjectId = require('../utilities/validateObjectId');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError.js');

const Camp = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../schema.js');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { body, rating } = req.body;
    const camp = await Camp.findById(id);
    const review = new Review({ body, rating });
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Nuova recensione aggiunta!');
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.delete('/:revId', validateObjectId, catchAsync(async (req, res) => {
    const { id, revId } = req.params;
    await Camp.findByIdAndUpdate(id, { $pull: { reviews: revId } });
    await Review.findByIdAndDelete(revId);
    req.flash('success', 'Recensione eliminata correttamente!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
