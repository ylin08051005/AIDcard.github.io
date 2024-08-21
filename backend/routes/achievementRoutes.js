const express = require('express');
const router = express.Router();
const Achievement = require('../models/achievementModel');
const User = require('../models/userModel');

// 解鎖成就的路由
router.post('/unlockAchievement', async (req, res) => {
    const { userId, achievementId } = req.body;
    
    try {
        let user = await User.findById(userId);
        let achievement = await Achievement.findById(achievementId);
        
        if (user && achievement) {
            user.points += achievement.points; // 增加成就獎勵的積分
            user.achievements.push(achievementId); // 假設用戶模型有成就字段
            await user.save();
            return res.json({ msg: '成就解鎖', points: user.points });
        } else {
            return res.status(404).json({ msg: '用戶或成就未找到' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
