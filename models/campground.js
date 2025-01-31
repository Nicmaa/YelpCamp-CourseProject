const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String,
    },
})

const Camp = mongoose.model('Camp', campSchema);

module.exports = Camp;
