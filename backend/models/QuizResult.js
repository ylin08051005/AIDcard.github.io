const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const quizResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
    timeSpent: { type: Number, required: true }, // 以秒為單位
    completionTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
