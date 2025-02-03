const mongoose = require('mongoose');
const ExpressError = require('./expressError');

const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ExpressError("ID non valido! Assicurati di inserire un ID corretto.", 400);
    next();
}

module.exports = validateObjectId;
