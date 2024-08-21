const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        // 替換 'your_database' 為你實際使用的資料庫名稱
        await mongoose.connect('mongodb://localhost:27017/web_easy', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('成功連接到 MongoDB 資料庫');
    } catch (error) {
        console.error('無法連接到 MongoDB 資料庫', error);
        process.exit(1); // 無法連接時結束進程
    }
}

// 執行資料庫連接
connectToDatabase();

module.exports = mongoose; // 將 mongoose 導出以便其他文件使用
