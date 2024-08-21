const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    points: { type: Number, default: 0 }, // 積分字段，默認為0
    dailyChallenge: { type: Boolean, default: false }, // 每日挑戰字段，默認未完成
});

module.exports = mongoose.model('User', UserSchema);