const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AchievementSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    points: { type: Number, required: true }, // 成就獎勵的積分
});

module.exports = mongoose.model('Achievement', AchievementSchema);
