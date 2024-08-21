const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],  // 選項應該是一個字符串數組
    correctAnswer: [{ type: String, required: true }]  // 正確答案應該是一個字符串數組
});

module.exports = mongoose.model('Quiz', QuizSchema);
