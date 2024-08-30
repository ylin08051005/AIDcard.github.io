// backend/app.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel'); // 引入userModel
const Achievement = require('./models/achievementModel');
const path = require('path'); // 新增這一行
const achievementRoutes = require('./routes/achievementRoutes');
const quizRoutes = require('./routes/quizRoutes');
const { router: authRoutes, authMiddleware } = require('./routes/authRoutes');

const app = express();

// 解析 JSON 請求
app.use(express.json());
// 使用路由
console.log('Before mounting achievements route');
app.use('/api/achievements', achievementRoutes);
console.log('After mounting achievements route');

app.use('/api/auth', authRoutes); // 使用 /api/auth 路由
app.use('/api', quizRoutes);

console.log("Quiz routes are set up");


// 設定靜態文件路徑，指向 'frontend/src' 目錄
app.use(express.static(path.join(__dirname, '../frontend/src'))); 

// 處理根路徑的 GET 請求
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src', 'index_new.html')); 
});

// 資料庫連接
mongoose.connect('mongodb://localhost:27017/web_easy', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// 註冊功能
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id }};
        const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: 360000 });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 登入功能
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id }};
        const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: 360000 });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 添加測驗完成的路由，假設測驗完成後獲得10分
app.post('/completeQuiz', async (req, res) => {
    const { userId } = req.body;
    
    try {
        let user = await User.findById(userId);
        if (user) {
            user.points += 10; // 增加10分
            await user.save();
            return res.json({ msg: '測驗完成，積分增加10分', points: user.points });
        } else {
            return res.status(404).json({ msg: '用戶未找到' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 獲取用戶排行榜，按積分從高到低排序
app.get('/leaderboard', async (req, res) => {
    try {
        let users = await User.find().sort({ points: -1 }).limit(10); // 查詢積分最高的前10位用戶
        return res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/completeDailyChallenge', async (req, res) => {
    const { userId } = req.body;
    
    try {
        let user = await User.findById(userId);
        if (user && !user.dailyChallenge) {
            user.points += 20; // 增加20分
            user.dailyChallenge = true; // 標記每日挑戰已完成
            await user.save();
            return res.json({ msg: '每日挑戰完成，積分增加20分', points: user.points });
        } else if (user.dailyChallenge) {
            return res.status(400).json({ msg: '今日挑戰已完成' });
        } else {
            return res.status(404).json({ msg: '用戶未找到' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/unlockAchievement', async (req, res) => {
    const { userId, achievementId } = req.body;

    console.log(`userId: ${userId}, achievementId: ${achievementId}`);  // 新增日誌

    try {
        let user = await User.findById(userId);
        let achievement = await Achievement.findById(achievementId);

        if (user && achievement) {
            user.points += achievement.points; // 增加成就獎勵的積分
            if (!user.achievements) {
                user.achievements = [];
            }
            user.achievements.push(achievementId);
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


app.post('/updateProfile', async (req, res) => {
    const { userId, profileData } = req.body;
    
    try {
        let user = await User.findById(userId);
        if (user) {
            // 假設 profileData 包含用戶的所有新資料
            Object.assign(user, profileData);
            await user.save();
            return res.json({ msg: '資料更新成功', user });
        } else {
            return res.status(404).json({ msg: '用戶未找到' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// 中間件的定義
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // 如果沒有 token，返回 401

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403); // 如果 token 無效，返回 403
        req.user = user; // 如果 token 有效，將用戶信息附加到請求對象
        next(); // 調用 next() 進入下一個中間件或路由處理程序
    });
}

// // 測試路由
// app.get('/test', (req, res) => {
//     res.send('Test route working');
// });


// 啟動伺服器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`伺服器運行在 http://localhost:${PORT}`));
