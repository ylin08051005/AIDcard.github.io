// backend/models/recyclingDiaryModel.js
const mongoose = require('mongoose');

const RecyclingDiarySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,  // 確保這些字段在保存和返回日記時被填充
    content: String,
    date: { type: Date, default: Date.now },
    image: String,
});

module.exports = mongoose.model('RecyclingDiary', RecyclingDiarySchema);