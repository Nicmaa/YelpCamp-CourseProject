const joi = require('joi');

module.exports.campgroundSchema = joi.object({
    title: joi.string().required(),
    price: joi.number().required().min(0),
    //image: joi.string().required(),
    location: joi.string().required(),
    description: joi.string().required(),
}).required();

module.exports.reviewSchema = joi.object({
    rating: joi.number().required().min(1).max(5),
    body: joi.string().required(),
}).required();
