## 上傳專案資料夾的方式
```
1. cd path/to/your/folder
2. git init
3. git add .
4. git commit -m "Initial commit
5. git push -u origin main
```

## 複製專案

```
git clone https://github.com/melody016861/AIDcard.github.io.git
cd AIDcard.github.io
```

下載影像辨識模型 VGG16 所需權重
https://drive.google.com/file/d/1JhLIOjlVwObElupBOCBrbdY0edNMgYQY/view?usp=sharing
並且將其放置於 backend/classification_model 中。

## 安裝需要的 module 
npm install express

開啟 server 端，可以傳送圖片

```
python backend\server.py
```
開啟另外一個終端機執行以下指令。開啟網頁，可以展示圖片
```
cd AIDcard.github.io
node frontend\app.js
```

進入此網址執行操作
http://localhost:3000/index.html

# 聖安
20240822
已將我的CNN影像辨識模型, VGG16 放到網頁上去、並且可以展示結果！

20240816
把詠琪的基礎網頁，增加可以讀取指定資料夾的最新圖片的網頁，並且也可以正常從我的手機傳到電腦上。

20240811
找到可以有方法可以做到把手機拍的照片傳到電腦上。code 留在 D 槽， codes, 然後學到了手機裡面的 “捷徑” app 這招！

## Todo
* 現階段僅接收 iphone 的圖片，而從手機傳到電腦的捷徑設置教學還沒進行。
* 將 gemini model 放上去。
* 把接收資料夾不要每次都用覆蓋的、可以自動偵測指定資料夾的檔名、並且自動加在最後面。

# 詠琪
20240822
1. 註冊登入功能完成。
2. 將測驗功能完成，並在測驗結束後可以返回排行榜網頁查看積分。
3. 測驗結果的圖表分析功能完成。
4. 在各個網頁中加入滾動式功能。

## Todo
1. 回收日記(將聖安的上傳圖片功能加入回收日記)
2. 抽獎機制
3. 爬蟲產出圖片的品質改進
4. 思考還有甚麼資料可以進行分析，並用視覺化去呈現
5. 回收教育宣導內容
