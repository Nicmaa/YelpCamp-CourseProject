const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

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
app.use(express.urlencoded({ extended: true }))

app.get('/campgrounds', async (req, res) => {
    const camps = await Camp.find({});
    res.render('allCamp.ejs', { camps });
})

app.get('/campgrounds/new', (req, res) => {
    res.render('newCamp.ejs');
})

app.post('/campgrounds', async (req, res) => {
    const newCamp = new Camp(req.body);
    await newCamp.save();
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log("Port 3000 opened!");
})
