const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/expressError');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/Campgrounds');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
    console.log("Database connected!");
})

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    secret: 'segreto temporaneo',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //Per questioni di sicurezza
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //Voglio che scada dopo una settimana (esprimo il tempo in millisecondi)
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

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
