const express = require('express');
const router = express.Router();
const Image = require('../models/Image');  // 使用正確的模型文件名

// 上傳圖片
router.post('/upload', async (req, res) => {
  try {
    const newImage = new Image({
      imageUrl: req.body.imageUrl,
      category: req.body.category
    });

    const savedImage = await newImage.save();
    res.status(200).json(savedImage);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 獲取所有圖片
router.get('/images', async (req, res) => {
  try {
    const images = await Image.find({});
    res.status(200).json(images);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 測試 GET 路由
router.get('/upload', (req, res) => {
  res.send('This is a GET request for /api/upload');
});

module.exports = router;
