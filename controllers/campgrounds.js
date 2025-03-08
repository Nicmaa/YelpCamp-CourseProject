const Camp = require('../models/campground');

module.exports.index = async (req, res) => {
    const camps = await Camp.find({});
    res.render('campgrounds/allCamp.ejs', { camps });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/newCamp.ejs');
};

module.exports.createCampground = async (req, res) => {
    const newCamp = new Camp(req.body);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Campeggio aggiunto correttamente!');
    res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.showCampground = async (req, res) => {
    const id = req.params.id;
    const camp = await Camp.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
            }
        })
        .populate('author');
    if (!camp) {
        req.flash('error', 'Campeggio non trovato!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/showCamp.ejs', { camp });
};

module.exports.renderEditForm = async (req, res) => {
    const id = req.params.id;
    const camp = await Camp.findById(id);
    if (!camp) {
        req.flash('error', 'Campeggio non trovato!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/editCamp.ejs', { camp });
};

module.exports.updateCampground = async (req, res) => {
    const id = req.params.id;
    const { title, location, description, price } = req.body
    const editedCamp = await Camp.findByIdAndUpdate(id, { title, location, description, price }, { new: true, runValidators: true });
    req.flash('success', 'Campeggio modificato correttamente!');
    res.redirect(`/campgrounds/${editedCamp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const id = req.params.id;
    await Camp.findByIdAndDelete(id);
    req.flash('success', 'Campeggio eliminato correttamente!');
    res.redirect('/campgrounds');
};
