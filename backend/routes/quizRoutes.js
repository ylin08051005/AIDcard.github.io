// routes/quizRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Quiz = require('../models/quizModel');
const AnswerRecord = require('../models/answerRecordModel');
const User = require('../models/userModel'); // 確保已正確導入 User 模型
const QuizResult = require('../models/QuizResult');

// 創建測驗的路由
router.post('/createQuiz', async (req, res) => {
    console.log("Received a POST request at /createQuiz");
    console.log("Request body:", req.body);

    const { question, options, correctAnswer } = req.body;

    try {
        const quiz = new Quiz({ question, options, correctAnswer });
        await quiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        console.error("Error creating quiz:", err.message);
        res.status(500).send('Server error');
    }
});

router.post('/submitQuiz', async (req, res) => {
    const { userId, selectedAnswers } = req.body;

    console.log('SubmitQuiz API called'); // 调试信息
    console.log('Received userId:', userId); // 打印接收到的 userId
    console.log('Received selectedAnswers:', selectedAnswers); // 打印接收到的 selectedAnswers

    try {
        if (!userId) {
            console.log('userId is missing');
            return res.status(400).json({ msg: 'userId is missing or invalid' });
        }

        // 檢查 userId 是否為有效的 ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log('Invalid userId:', userId);
            return res.status(400).json({ msg: 'Invalid userId' });
        }

        // 确保 User 模型正确导入
        console.log('Attempting to find user in the database...');
        console.log('User model:', User); // 确保模型加载正确
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found for userId:', userId);
            return res.status(404).json({ msg: 'User not found' });
        }

        console.log('User found:', user); // 打印找到的用户信息

        let totalCorrect = true;

        for (const answer of selectedAnswers) {
            const { quizId, selectedOptions } = answer;

            if (!quizId) {
                console.log('quizId is missing');
                return res.status(400).json({ msg: 'quizId is missing or invalid' });
            }

            // 檢查 quizId 是否為有效的 ObjectId
            if (!mongoose.Types.ObjectId.isValid(quizId)) {
                console.log('Invalid quizId:', quizId);
                return res.status(400).json({ msg: 'Invalid quizId' });
            }

            // 确保 Quiz 模型正确查找
            console.log('Attempting to find quiz in the database...');
            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                console.log('Quiz not found for quizId:', quizId);
                return res.status(404).json({ msg: 'Quiz not found' });
            }

            console.log('Quiz found:', quiz); // 打印找到的测验信息

            const isCorrect = quiz.correctAnswer.length === selectedOptions.length &&
                selectedOptions.every(option => quiz.correctAnswer.includes(option));

            const answerRecord = new AnswerRecord({
                userId,
                quizId,
                selectedOptions,
                isCorrect,
                timestamp: new Date()
            });

            try {
                await answerRecord.save();
                console.log(`Answer record saved for quizId: ${quizId}`);
            } catch (saveError) {
                console.log('Error saving answerRecord:', saveError);
                return res.status(500).json({ msg: 'Failed to save answer record' });
            }

            // totalCorrect = totalCorrect && isCorrect;
            if (isCorrect) {
                totalCorrect += 1; // 每答对一题，积分加1分（根据实际情况修改）
            }
        }

        // 更新用户的积分
        user.points += totalCorrect;
        await user.save();
        console.log(`Updated user points: ${user.points}`); // 确保积分已更新

        res.json({ isCorrect: totalCorrect === selectedAnswers.length, msg: totalCorrect > 0 ? '积分已更新！' : '没有答对任何题目。' });
        // res.json({ isCorrect: totalCorrect, msg: totalCorrect ? '所有題目回答正確！' : '有些題目回答錯誤！' });

    } catch (err) {
        console.log('Error in submitQuiz route:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});



// 獲取每個測驗的答對百分比
router.get('/quizStats/:quizId', async (req, res) => {
    const { quizId } = req.params;
    console.log(`Received quizId: ${quizId}`);  // 日誌

    try {
        // 檢查 quizId 是否為有效的 ObjectId
        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ msg: 'Invalid quizId' });
        }

        // 確認 quizId 在資料庫中是否存在
        const quizExists = await Quiz.findById(quizId);
        if (!quizExists) {
            console.log(`Quiz with id ${quizId} does not exist in the database`);
            return res.status(404).json({ msg: 'Quiz not found' });
        }
        
        // 查询该 quizId 的总答题数
        const totalAttempts = await AnswerRecord.countDocuments({ quizId });
        // 查询该 quizId 的正确答题数
        const correctAttempts = await AnswerRecord.countDocuments({ quizId, isCorrect: true });

        // 计算答对率
        const correctPercentage = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

        res.json({
            quizId,
            totalAttempts,
            correctAttempts,
            correctPercentage
        });
    } catch (err) {
        console.error('Error fetching quiz stats:', err.message);
        res.status(500).send('伺服器錯誤');
    }
});

// 獲取所有測驗
router.get('/getQuizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (err) {
        console.error('Error fetching quizzes:', err.message);
        res.status(500).send('伺服器錯誤');
    }
});

// 获取所有测验的ID和问题
router.get('/getAllQuizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find({}, '_id question'); // 只获取ID和问题
        res.json(quizzes);
    } catch (err) {
        console.error('Error fetching quizzes:', err.message);
        res.status(500).send('伺服器錯誤');
    }
});

// 測驗結果分析
router.get('/quizResults', async (req, res) => {
    try {
        const results = await QuizResult.find().populate('quizId userId');
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quiz results' });
    }
});

// 用戶參與度追蹤
router.get('/userParticipation', async (req, res) => {
    try {
        const participation = await QuizResult.aggregate([
            { $group: { _id: "$userId", participationCount: { $sum: 1 } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { _id: 0, username: '$user.username', participationCount: 1 } }
        ]);
        res.json(participation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user participation data' });
    }
});

// 測驗時間與表現分析
router.get('/timePerformance', async (req, res) => {
    try {
        const performance = await QuizResult.aggregate([
            { $group: { _id: "$quizId", averageTime: { $avg: "$timeSpent" }, averageScore: { $avg: "$score" } } },
            { $lookup: { from: 'quizzes', localField: '_id', foreignField: '_id', as: 'quiz' } },
            { $unwind: '$quiz' },
            { $project: { _id: 0, quizName: '$quiz.question', averageTime: 1, averageScore: 1 } }
        ]);
        res.json(performance);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch time and performance data' });
    }
});

// 測驗完成時間分佈
router.get('/completionTimeDistribution', async (req, res) => {
    try {
        const completionTimes = await QuizResult.aggregate([
            { $bucket: {
                groupBy: "$timeSpent",
                boundaries: [0, 60, 120, 180, 240, 300, 600, 1200],
                default: "Other",
                output: { count: { $sum: 1 } }
            }}
        ]);
        res.json(completionTimes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch completion time distribution' });
    }
});

// CNN準確率分析（假設你有一個單獨的模型來存放CNN的準確率數據）
router.get('/cnnAccuracy', async (req, res) => {
    try {
        const accuracyData = await CNNAccuracyModel.find().sort({ timestamp: 1 });
        res.json(accuracyData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch CNN accuracy data' });
    }
});

// 用戶學習進步追蹤
router.get('/userProgress', async (req, res) => {
    try {
        const progress = await QuizResult.aggregate([
            { $group: { _id: "$userId", scores: { $push: "$score" }, timestamps: { $push: "$completionTime" } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { _id: 0, username: '$user.username', scores: 1, timestamps: 1 } }
        ]);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user progress data' });
    }
});



module.exports = router;
