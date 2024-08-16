## 複製專案

```
git clone https://github.com/melody016861/AIDcard.github.io.git
cd AIDcard.github.io
```

## 安裝需要的 module 
```
cd Web_easy\frontend
npm install express
```

## Run

```
cd ../..
```

開啟 server 端，可以傳送圖片

```
python Web_easy\backend\server.py
```
開啟另外一個終端機執行以下指令。開啟網頁，可以展示圖片
```
cd AIDcard.github.io
node Web_easy\frontend\app.js
```

進入此網址執行操作
http://localhost:3000/index.html