// models/lotteryRecordModel.js
const mongoose = require('mongoose');

const LotteryRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prize: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LotteryRecord', LotteryRecordSchema);
