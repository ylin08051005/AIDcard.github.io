const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 註冊新使用者
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 檢查使用者是否已存在
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: '使用者已存在' });
        }

        // 創建新用戶
        user = new User({ username, password });

        // 密碼哈希處理
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 保存用戶到資料庫
        await user.save();

        // 創建 JWT
        const payload = { user: { id: user.id }};
        const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: 360000 });

        // 回應成功訊息並跳轉到登入頁面
        res.status(201).json({ message: '註冊成功，請登入' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

// 使用者登入
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 查找使用者
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: '使用者不存在' });
        }

        // 檢查密碼
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '密碼錯誤' });
        }

        // 簽發 JWT
        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

        // 返回 token 和 userId
        res.json({ token, userId: user.id, message: '登入成功' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

function authMiddleware(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

// 例如：保護的路由
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ msg: 'This is a protected route' });
});

module.exports = router;
