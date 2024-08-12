const express = require('express');
const path = require('path');
const app = express();

// 設定靜態文件路徑，指向 'src' 目錄
app.use(express.static(path.join(__dirname, 'src')));

// 根路由對應 'index.html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// 其他頁面路由
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'contact.html'));
});

for (let i = 1; i <= 10; i++) {
    app.get(`/page_${i}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'src', `page_${i}.html`));
    });
}

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
