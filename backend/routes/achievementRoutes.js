// backend/routes/achievementRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Achievement = require('../models/achievementModel');
const User = require('../models/userModel');
// const { authMiddleware } = require('./authRoutes');
const authMiddleware = require('../routes/authRoutes').authMiddleware;


// 獲取所有成就的路由
router.get('/', async (req, res) => {
    try {
        const achievements = await Achievement.find();
        res.json(achievements);
    } catch (err) {
        console.error('Error fetching achievements:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// 創建成就的路由
router.post('/', async (req, res) => {
    const { name, description, points } = req.body;

    try {
        const newAchievement = new Achievement({ name, description, points });
        await newAchievement.save();
        return res.status(201).json(newAchievement);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
});

// 創建成就的路由
router.post('/createAchievement', async (req, res) => {
    const { name, description, points } = req.body;

    try {
        const newAchievement = new Achievement({ name, description, points });
        await newAchievement.save();
        return res.status(201).json(newAchievement);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
});

// 獲取所有成就的路由
router.get('/achievements', async (req, res) => {
    console.log('Fetching all achievements');
    try {
        const achievements = await Achievement.find();
        console.log('Achievements fetched:', achievements);
        res.json(achievements);
    } catch (err) {
        console.error('Error fetching achievements:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/unlockAchievement', (req, res) => {
    res.json({ msg: '這是GET請求的測試路由，解鎖成就應使用POST請求' });
});

// 解鎖成就的路由
router.post('/unlockAchievement', authMiddleware, async (req, res) => {
    // const userId = req.user ? req.user.id : null;
    // const userId = req.user && req.user.userId ? req.user.userId : null;
    const userId = req.user.userId; // 確保直接從 req.user 中獲取 userId

    console.log('Received userId:', userId);  // 调试信息

    if (!userId) {
        return res.status(400).json({ msg: 'User ID is missing or invalid' });
    }

    // 這裡添加你的邏輯來處理用戶成就
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found:', userId);
            return res.status(404).json({ msg: 'User not found' });
        }

        // 這裡添加你的邏輯來決定該解鎖哪一個成就
        // 例如，如果用戶完成了某一個測驗，可以解鎖對應的成就
        const achievement = await Achievement.findOne({ name: 'Complete 10 Quizzes' });

        // 添加日誌來檢查 achievementId
        console.log('Received achievement:', achievement);

        if (!achievement) {
            console.error('Achievement not found:', achievement._id);
            return res.status(404).json({ msg: 'Achievement not found' });
        }

        // 檢查用戶是否已經解鎖了該成就
        if (!user.achievements.includes(achievement._id)) {
            user.points += achievement.points;
            user.achievements.push(achievement._id);
            await user.save();
            return res.json({ msg: 'Achievement unlocked', points: user.points });
        } else {
            return res.status(200).json({ msg: 'Achievement already unlocked' });
        }
    } catch (err) {
        console.error('Error in unlocking achievement:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
