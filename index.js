const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017/Campgrounds');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
    console.log("Database connected!");
})

const app = express();

const Camp = require('./models/campground');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get('/campgrounds', async (req, res) => {
    const camps = await Camp.find({});
    res.render('allCamp.ejs', { camps });
})

app.get('/campgrounds/new', (req, res) => {
    res.render('newCamp.ejs');
})

app.get('/campgrounds/:id', async (req, res) => {
    const id = req.params.id;
    const camp = await Camp.findById(id);
    res.render('showCamp.ejs', { camp });
})

app.post('/campgrounds', async (req, res) => {
    const newCamp = new Camp(req.body);
    await newCamp.save();
    res.redirect('/campgrounds');
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const id = req.params.id;
    const camp = await Camp.findById(id);
    res.render('editCamp.ejs', { camp });
})

app.put('/campgrounds/:id', async (req, res) => {
    const id = req.params.id;
    const { title, location, description, price } = req.body
    const editedCamp = await Camp.findByIdAndUpdate(id, { title, location, description, price }, { new: true, runValidators: true });
    res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    const id = req.params.id;
    await Camp.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log("Port 3000 opened!");
})
