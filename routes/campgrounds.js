const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync');
const validateObjectId = require('../utilities/validateObjectId');
const ExpressError = require('../utilities/expressError');

const Camp = require('../models/campground');
const { campgroundSchema } = require('../schema.js');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const camps = await Camp.find({});
    res.render('allCamp.ejs', { camps });
}))

router.get('/new', (req, res) => {
    res.render('newCamp.ejs');
})

router.get('/:id', validateObjectId, catchAsync(async (req, res) => {
    const id = req.params.id;
    const camp = await Camp.findById(id).populate('reviews');
    if (!camp) {
        req.flash('error', 'Campeggio non trovato!');
        return res.redirect('/campgrounds');
    }
    res.render('showCamp.ejs', { camp });
}))

router.post('/', validateCampground, catchAsync(async (req, res) => {
    const newCamp = new Camp(req.body);
    await newCamp.save();
    req.flash('success', 'Campeggio aggiunto correttamente!');
    res.redirect(`/campgrounds/${newCamp._id}`);
}))

router.get('/:id/edit', validateObjectId, catchAsync(async (req, res) => {
    const id = req.params.id;
    const camp = await Camp.findById(id);
    if (!camp) {
        req.flash('error', 'Campeggio non trovato!');
        return res.redirect('/campgrounds');
    }
    res.render('editCamp.ejs', { camp });
}))

router.put('/:id', validateObjectId, validateCampground, catchAsync(async (req, res) => {
    const id = req.params.id;
    const { title, location, description, price } = req.body
    const editedCamp = await Camp.findByIdAndUpdate(id, { title, location, description, price }, { new: true, runValidators: true });
    req.flash('success', 'Campeggio modificato correttamente!');
    res.redirect(`/campgrounds/${editedCamp._id}`);
}))

router.delete('/:id', validateObjectId, catchAsync(async (req, res) => {
    const id = req.params.id;
    await Camp.findByIdAndDelete(id);
    req.flash('success', 'Campeggio eliminato correttamente!');
    res.redirect('/campgrounds');
}))

module.exports = router;
