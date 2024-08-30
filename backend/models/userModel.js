const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    points: { type: Number, default: 0 }, // 積分字段，默認為0
    dailyChallenge: { type: Boolean, default: false }, // 每日挑戰字段，默認未完成
    achievements: {
        type: [mongoose.Schema.Types.ObjectId], // 成就ID的陣列，引用Achievement模型
        ref: 'Achievement',
        default: [] // 初始化為空陣列
    }
});

module.exports = mongoose.model('User', UserSchema);