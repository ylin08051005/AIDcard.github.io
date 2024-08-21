// 這個模型記錄了用戶提交的答案和結果。
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerRecordSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    selectedOptions: [{ type: String, required: true }],
    isCorrect: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AnswerRecord', AnswerRecordSchema);
