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

# 聖安 Todo
* 現階段僅接收 iphone 的圖片，而從手機傳到電腦的捷徑設置教學還沒進行。
* 僅處理 jpg 檔，需要 iphone 使用者從手機調設定，未來想處理 heic 檔。
* 將 CNN model 放上去。
* 將 gemini model 放上去。
* 把接收資料夾不要每次都用覆蓋的、可以自動偵測指定資料夾的檔名、並且自動加在最後面。
