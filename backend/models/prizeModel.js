const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'diamond'],
        required: true
    },
    probability: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Prize', prizeSchema);
