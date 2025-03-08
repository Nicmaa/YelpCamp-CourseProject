const Review = require('../models/review');
const Camp = require('../models/campground');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const { body, rating } = req.body;
    const camp = await Camp.findById(id);
    const review = new Review({ body, rating });
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Nuova recensione aggiunta!');
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, revId } = req.params;
    await Camp.findByIdAndUpdate(id, { $pull: { reviews: revId } });
    await Review.findByIdAndDelete(revId);
    req.flash('success', 'Recensione eliminata correttamente!');
    res.redirect(`/campgrounds/${id}`);
};
