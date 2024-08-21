// frontend/app.js

const express = require('express');
const path = require('path');
const app = express();

// 設定靜態文件路徑，指向 'src' 目錄
app.use(express.static(path.join(__dirname, 'src')));

// 根路由對應 'index.html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'register.html'));
});


for (let i = 1; i <= 10; i++) {
    app.get(`/page_${i}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'src', `page_${i}.html`));
    });
}

app.get(`/page_example`, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', `page_example.html`));
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    // console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Server is running on http://localhost:${PORT}/index.html`);
});
