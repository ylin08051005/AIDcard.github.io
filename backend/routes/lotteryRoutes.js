const express = require('express');
const router = express.Router();
const Prize = require('../models/prizeModel');
const User = require('../models/userModel');
const authMiddleware = require('./authRoutes').authMiddleware;

// 定義用戶等級的劃分
const levels = {
    bronze: 100,
    silver: 500,
    gold: 1000
};

// 抽獎機制
router.post('/lottery', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        let userLevel = 'bronze';
        if (user.points > levels.gold) {
            userLevel = 'diamond';
        } else if (user.points > levels.silver) {
            userLevel = 'gold';
        } else if (user.points > levels.bronze) {
            userLevel = 'silver';
        }

        // 從對應等級的獎池中隨機選擇一個獎品
        const prizes = await Prize.find({ level: userLevel });
        const totalProbability = prizes.reduce((total, prize) => total + prize.probability, 0);
        const random = Math.random() * totalProbability;
        let cumulativeProbability = 0;
        let selectedPrize = null;

        for (let prize of prizes) {
            cumulativeProbability += prize.probability;
            if (random <= cumulativeProbability) {
                selectedPrize = prize;
                break;
            }
        }

        if (!selectedPrize) {
            return res.status(500).json({ msg: '抽獎失敗，請稍後再試' });
        }

        // 可以在這裡記錄抽獎結果，或者將獎品添加到用戶賬戶中
        res.json({ msg: `恭喜你！你獲得了${selectedPrize.name}` });
    } catch (err) {
        console.error('抽獎錯誤:', err.message);
        res.status(500).json({ msg: '伺服器錯誤' });
    }
});

module.exports = router;
