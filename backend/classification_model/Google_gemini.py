import os
import google.generativeai as genai
import time
import os
import requests
import base64
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report




# 將 API 鍵設置為變數
GOOGLE_API_KEY = "AIzaSyCnzKY6McxENFeJDwfrODSXq49GNc9ji_w"

genai.configure(api_key=os.environ["GOOGLE_API_KEY"])


model = genai.GenerativeModel("gemini-1.5-flash")

# 定義圖片所在路徑
dir_path = r"C:\test\Google_Gemini_API\dataset-resized\trash"
url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GOOGLE_API_KEY}"


# 定義分類函數
def classification(img_path):
     with open(img_path, "rb") as image_file:
        image_base64_string = base64.b64encode(image_file.read()).decode('utf-8')

    # 構建請求數據
        headers = {'Content-Type': 'application/json'}
        data = {
            "contents": [
            {
                "parts": [
                    {"text": """ Glass: Items made from glass, including bottles, jars, and containers. These are typically clear, green, or brown and can be recycled to create new glass products.
                            Metal: Items made from metals such as aluminum, steel, and tin. This includes cans, foil, and certain metal containers. These can be recycled to produce new metal materials.
                            Paper: Items made from paper, including newspapers, magazines, office paper, and cardboard (if it’s clean and not greasy). Paper products are often recycled into new paper products.
                            Cardboard:A specific type of paper that is thicker and stronger, typically used for packaging and boxes. Cardboard can be recycled to make new cardboard products or paper products.
                            Plastic:Items made from plastic, such as bottles, containers, and packaging. Plastics are often labeled with numbers that indicate the type of plastic, and different types are recycled in different ways.
                            Trash:Items that do not fall into any of the recyclable categories, including food waste, dirty or greasy paper, certain plastics, and mixed materials that cannot be easily separated.Trash is generally sent to landfills or incinerated.
                            Here are the definitions for the six recycling categories.Which category does this image belong to: glass, metal, paper, cardboard, plastic, or trash ? 
                            Please directly output one of these categories without any other words, and must choose one closest to definitions.If the image cannot be recognized, it will be classified as trash."""},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": image_base64_string
                        }
                    }
                ]
            }
        ]
    }


        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            try:
                result = response.json()

                answer = result['candidates'][0]['content']['parts'][0]['text'].strip()
                valid_categories = ['glass', 'metal', 'paper', 'cardboard', 'plastic', 'trash']
                if answer.lower() in valid_categories:
                    return answer
                else:
                    return "trash"  # 如果答案無效，返回 "trash"
            except KeyError:
                return "trash"  # 如果 KeyError，返回 "trash"
        else:
            return "trash"  # 如果請求失敗，返回 "trash"

def classification_with_retry(img_path, retries=3, delay=5):
    for attempt in range(retries):
        try:
            return classification(img_path) or "trash"  # 無論如何返回 "trash"
        except requests.ConnectionError:
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                return "trash"  # 如果所有嘗試失敗，返回 "trash"

true_labels = []
predicted_labels = []


for root, dirs, files in os.walk(dir_path):
    for filename in files:
        if filename.lower().endswith('.jpg'):
            img_path = os.path.join(root, filename)
            
            true_label = os.path.basename(root).lower()
            
            # 如果是在 __MACOSX 資料夾中，跳過
            if '__MACOSX' in root:
                continue
            
            predicted_label = classification_with_retry(img_path)
            
            if predicted_label is not None:
                true_labels.append(true_label)
                predicted_labels.append(predicted_label)
            
            print(f"{filename} ：{predicted_label}")
            
            time.sleep(2)

if len(true_labels) != len(predicted_labels):
    raise ValueError("The number of filtered true labels and predicted labels do not match.")

# 準確度計算
accuracy = accuracy_score(true_labels, predicted_labels)
print(f"準確度: {accuracy:.2f}")

# 分類報告
all_possible_labels = ['glass', 'metal', 'paper', 'cardboard', 'plastic', 'trash']
class_report = classification_report(true_labels, predicted_labels, labels=all_possible_labels)
print("分類報告:")
print(class_report)




