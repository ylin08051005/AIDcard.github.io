const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/your_db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected');
  // 初始化資料
  const images = [
    { imageUrl: 'http://example.com/image1.jpg', category: '可回收' },
    { imageUrl: 'http://example.com/image2.jpg', category: '不可回收' }
  ];
  Image.insertMany(images, (err) => {
    if (err) throw err;
    console.log('Data inserted');
    db.close();
  });
});
