## 上傳專案資料夾的方式
```
1. cd path/to/your/folder
2. git init
3. git add .
4. git commit -m "Initial commit"
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

查看爬蟲產出的圖片: 
https://drive.google.com/drive/u/0/folders/1HIoygEZd4SJUjBsbMcyo2UV16g3QcEI9

## 安裝需要的 module 

開啟 server 端，可以傳送圖片

```
python backend\server.py
```
開啟另外一個終端機執行以下指令。開啟網頁，可以展示圖片
```
cd AIDcard.github.io
npm install express
node frontend\app.js
```

進入此網址執行操作
http://localhost:3000/index.html

# 聖安
20240822
已將我的CNN影像辨識模型, VGG16，訓練於 trashnet 資料集，放到網頁上去、並且可以展示結果！

20240816
把詠琪的基礎網頁，增加可以讀取指定資料夾的最新圖片的網頁，並且也可以正常從我的手機傳到電腦上。

20240811
找到可以有方法可以做到把手機拍的照片傳到電腦上。code 留在 D 槽， codes, 然後學到了手機裡面的 “捷徑” app 這招！

## Todo
* 增加如何將 iphone 圖片傳送到電腦的教學
* 增加怎麼創虛擬環境、深度學習模型所需 package 的教學
* 將 gemini model 放上去。
* 把接收資料夾不要每次都用覆蓋的、可以自動偵測指定資料夾的檔名、並且自動加在最後面。
* 多 train 一個 yolo 上去做 object detection.
https://github.com/AgaMiko/waste-datasets-review
* 想辦法讓使用者也可以自己上傳圖片
* 多 train 一個 mobilenet 上去。
* 紀錄回收內容。
* 有三個影像辨識模型可以做投票。
* Arduino 有機會可以做重量預測?
* 有沒有可能用 generative AI, 生成垃圾圖片?

# 詠琪
20240825
1. 爬蟲圖片品質提升。不過一般垃圾的圖片品質依然無法解決。
2. Image Predict 路徑問題解決。
3. Figma 流程圖完成。

20240822
1. 註冊登入功能完成。
2. 將測驗功能完成，並在測驗結束後可以返回排行榜網頁查看積分。
3. 測驗結果的圖表分析功能完成。
4. 在各個網頁中加入滾動式功能。

## Todo
1. 回收日記(將聖安的上傳圖片功能加入回收日記)
2. 抽獎機制
3. 社群互動
4. 資料分析 :
   a. 測驗結果分析
   b. 追蹤用戶進行測驗的次數，並視覺化參與度隨時間的變化
   c. 分析用戶在每個測驗上花費的平均時間，並將其與表現進行關聯。
   d. 視覺化測驗完成時間的分佈，以辨識哪些測驗較耗時。
   e. CNN準確率 (x : 時間軸；y : 準確率)
5. 回收教育宣導內容
