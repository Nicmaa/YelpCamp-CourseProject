const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utilities/expressError');
const catchAsync = require('./utilities/catchAsync');
const validateObjectId = require('./utilities/validateObjectId');
const { campgroundSchema } = require('./schema.js');

mongoose.connect('mongodb://127.0.0.1:27017/Campgrounds');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
    console.log("Database connected!");
})

const app = express();

const Camp = require('./models/campground');

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/campgrounds', catchAsync(async (req, res) => {
    const camps = await Camp.find({});
    res.render('allCamp.ejs', { camps });
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('newCamp.ejs');
})

app.get('/campgrounds/:id', validateObjectId, catchAsync(async (req, res) => {
    const id = req.params.id;
    const camp = await Camp.findById(id);
    if (!camp) throw new ExpressError("Camping non trovato!", 404);
    res.render('showCamp.ejs', { camp });
}))

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    const newCamp = new Camp(req.body);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}))

app.get('/campgrounds/:id/edit', validateObjectId, catchAsync(async (req, res) => {
    const id = req.params.id;
    const camp = await Camp.findById(id);
    if (!camp) throw new ExpressError("Camping non trovato!", 404);
    res.render('editCamp.ejs', { camp });
}))

app.put('/campgrounds/:id', validateObjectId, validateCampground, catchAsync(async (req, res) => {
    const id = req.params.id;
    const { title, location, description, price } = req.body
    const editedCamp = await Camp.findByIdAndUpdate(id, { title, location, description, price }, { new: true, runValidators: true });
    res.redirect(`/campgrounds/${id}`);
}))

app.delete('/campgrounds/:id', validateObjectId, catchAsync(async (req, res) => {
    const id = req.params.id;
    await Camp.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Pagina non Trovata', 404));
})

app.use((err, req, res, next) => {
    const { status = 500, message = "Qualcosa è andato storto!" } = err;
    res.status(status).render('error', { status, message });
})

app.listen(3000, () => {
    console.log("Port 3000 opened!");
})
