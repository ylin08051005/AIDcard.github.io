# backend/classification_model/Google_gemini.py
import os
import google.generativeai as genai
import time
import requests
import base64
from PIL import Image
import io



# 設置 API 鍵
GOOGLE_API_KEY = "AIzaSyCnzKY6McxENFeJDwfrODSXq49GNc9ji_w"

genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

model = genai.GenerativeModel("gemini-1.5-flash")



# 定義 API URL
url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GOOGLE_API_KEY}"

def classification(image):
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    image_base64_string = base64.b64encode(buffered.getvalue()).decode('utf-8')

    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [
            {
                "parts": [
                    {"text": "Which category does this image belong to: glass, metal, paper, cardboard, plastic, or trash?"},
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
            return answer if answer.lower() in valid_categories else "trash"
        except KeyError:
            return "trash"
    return "trash"

def classify_image_with_retry(image, retries=3, delay=5):
    for attempt in range(retries):
        try:
            return classification(image) or "trash"
        except requests.ConnectionError:
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                return "trash"