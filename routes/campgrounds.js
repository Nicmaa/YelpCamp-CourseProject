const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync');
const validateObjectId = require('../utilities/validateObjectId');

const Camp = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');

router.get('/', catchAsync(async (req, res) => {
    const camps = await Camp.find({});
    res.render('campgrounds/allCamp.ejs', { camps });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/newCamp.ejs');
})

router.get('/:id', validateObjectId, catchAsync(async (req, res) => {
    const id = req.params.id;
    const camp = await Camp.findById(id).populate('reviews').populate('author');
    if (!camp) {
        req.flash('error', 'Campeggio non trovato!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/showCamp.ejs', { camp });
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const newCamp = new Camp(req.body);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Campeggio aggiunto correttamente!');
    res.redirect(`/campgrounds/${newCamp._id}`);
}))

router.get('/:id/edit', isLoggedIn, isAuthor, validateObjectId, catchAsync(async (req, res) => {
    const id = req.params.id;
    const camp = await Camp.findById(id);
    if (!camp) {
        req.flash('error', 'Campeggio non trovato!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/editCamp.ejs', { camp });
}))

router.put('/:id', isLoggedIn, isAuthor, validateObjectId, validateCampground, catchAsync(async (req, res) => {
    const id = req.params.id;
    const { title, location, description, price } = req.body
    const editedCamp = await Camp.findByIdAndUpdate(id, { title, location, description, price }, { new: true, runValidators: true });
    req.flash('success', 'Campeggio modificato correttamente!');
    res.redirect(`/campgrounds/${editedCamp._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, validateObjectId, catchAsync(async (req, res) => {
    const id = req.params.id;
    await Camp.findByIdAndDelete(id);
    req.flash('success', 'Campeggio eliminato correttamente!');
    res.redirect('/campgrounds');
}))

module.exports = router;
