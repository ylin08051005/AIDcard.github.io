// routes/quizRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Quiz = require('../models/quizModel');
const AnswerRecord = require('../models/answerRecordModel');

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

// 用戶提交測驗答案
// router.post('/submitQuiz', async (req, res) => {
//     const { userId, selectedAnswers } = req.body;

//     // 1. 檢查 userId 是否有效
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//         return res.status(400).json({ msg: '無效的 userId' });
//     }

//     const userObjectId = new mongoose.Types.ObjectId(userId); // 確保 userId 正確生成 ObjectId

//     // 檢查 userId 是否在資料庫中存在
//     const user = await User.findById(userObjectId);
//     if (!user) {
//         return res.status(404).json({ msg: '用戶未找到' });
//     }

//     console.log('Received userId:', userId);
//     console.log('Received selectedAnswers:', selectedAnswers);

//     try {
//         let totalCorrect = true;
        
//         for (const answer of selectedAnswers) {
//             const { quizId, selectedOptions } = answer;

//             // 2. 檢查 quizId 是否有效
//             if (!mongoose.Types.ObjectId.isValid(quizId)) {
//                 console.error('Invalid quizId:', quizId);
//                 return res.status(400).json({ msg: 'Invalid quizId' });
//             }

//             // 使用 new 關鍵字來實例化 ObjectId
//             const objectId = new mongoose.Types.ObjectId(quizId);
//             console.log('Generated ObjectId:', objectId); // 確認它是否正確生成

//             // 檢查 quizId 是否在資料庫中存在
//             const quiz = await Quiz.findById(objectId);
//             if (!quiz) {
//                 return res.status(404).json({ msg: '測驗未找到' });
//             }

//             // 核對答案是否正確
//             const isCorrect = quiz.correctAnswer.length === selectedOptions.length &&
//                 selectedOptions.every(option => quiz.correctAnswer.includes(option));
            
//             totalCorrect = totalCorrect && isCorrect;

//             // 保存答題記錄
//             const answerRecord = new AnswerRecord({
//                 userId: userObjectId, // 使用轉換後的 ObjectId
//                 quizId: objectId,  // 使用 ObjectId
//                 selectedOptions,
//                 isCorrect
//             });

//         try {
//             await answerRecord.save();
//             console.log(`Answer for quiz ${quizId} saved successfully.`);
//         } catch (saveError) {
//             console.error(`Error saving answer for quiz ${quizId}:`, saveError);
//             return res.status(500).json({ msg: '保存答題記錄時發生錯誤' });
//         }
//     }

//         res.json({ isCorrect: totalCorrect, msg: totalCorrect ? '所有題目回答正確！' : '有些題目回答錯誤！' });
//     } catch (err) {
//         console.error('Error during quiz submission:', err);
//         res.status(500).send('Server error');
//     }
// });

router.post('/submitQuiz', async (req, res) => {
    const { userId, selectedAnswers } = req.body;

    try {
        if (!userId) {
            console.log('userId is missing');
            return res.status(400).json({ msg: 'userId is missing or invalid' });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found for userId:', userId);
            return res.status(404).json({ msg: 'User not found' });
        }

        let totalCorrect = true;

        for (const answer of selectedAnswers) {
            const { quizId, selectedOptions } = answer;

            if (!quizId) {
                console.log('quizId is missing');
                return res.status(400).json({ msg: 'quizId is missing or invalid' });
            }

            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                console.log('Quiz not found for quizId:', quizId);
                return res.status(404).json({ msg: 'Quiz not found' });
            }

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

            totalCorrect = totalCorrect && isCorrect;
        }

        res.json({ isCorrect: totalCorrect, msg: totalCorrect ? '所有題目回答正確！' : '有些題目回答錯誤！' });

    } catch (err) {
        console.log('Error in submitQuiz route:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});





// 獲取每個測驗的答對百分比
router.get('/quizStats/:quizId', async (req, res) => {
    const { quizId } = req.params;

    try {
        const totalAttempts = await AnswerRecord.countDocuments({ quizId });
        const correctAttempts = await AnswerRecord.countDocuments({ quizId, isCorrect: true });

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

module.exports = router;
