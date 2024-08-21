import asyncio
import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
from pyppeteer import launch  # 使用 pyppeteer 而不是 pyppeteer2
from IPython.display import display # type: ignore
import nest_asyncio # type: ignore
import os # 用來處理檔案路徑和創建資料夾

nest_asyncio.apply()

async def fetch_image_urls(query, max_links_to_fetch):
    browser = await launch(executablePath='C:\\Program Files\\Google\\Chrome\\Application\\new_chrome.exe', headless=True, args=['--no-sandbox'])
    try:
        page = await browser.newPage()
        search_url = f"https://www.google.com/search?q={query}&tbm=isch"
        await page.goto(search_url)
        image_urls = set()

        for _ in range(10):  # adjust the range to control scrolling
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight);')
            await asyncio.sleep(1)
            page_content = await page.content()
            soup = BeautifulSoup(page_content, 'html.parser')
            img_elements = soup.find_all('img')
            for img_elem in img_elements:
                url = img_elem.get('src') or img_elem.get('data-src')
                if url and url.startswith('http'):
                    image_urls.add(url)
                if len(image_urls) >= max_links_to_fetch:
                    break
            if len(image_urls) >= max_links_to_fetch:
                break

    finally:
        await browser.close()
        
    return list(image_urls)[:max_links_to_fetch]

def save_images(image_urls, folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    for i, url in enumerate(image_urls):
        try:
            response = requests.get(url)
            image = Image.open(BytesIO(response.content))
            
            # 將圖片轉換為 RGB 模式，這樣可以保存為 JPEG
            if image.mode in ("P", "RGBA"):
                image = image.convert("RGB")
            
            image_path = os.path.join(folder_path, f'image_{i+1}.jpg')
            image.save(image_path)
            print(f"Saved {image_path}")
        except Exception as e:
            print(f"Could not save {url}: {e}")

def main():
    query = "紙板"
    max_images = 1000
    folder_path = "紙板_images"  # 設置圖片保存的文件夾路徑

    print("Fetching image URLs...")
    image_urls = asyncio.get_event_loop().run_until_complete(fetch_image_urls(query, max_images))
    print(f"Found {len(image_urls)} images.")
    
    # 保存圖片到本機
    save_images(image_urls, folder_path)
    
    # 將圖片URL和標籤發送到Flask服務器
    # server_url = "https://eb10-2402-7500-4dc-2d02-acaf-350e-6652-a529.ngrok-free.app/receive_images"
    server_url = "http://127.0.0.1:5000/receive_images"

    data = {
        "image_urls": image_urls,
        "label": "紙板"
    }
    response = requests.post(server_url, json=data)

    # 列印服務器的響應
    print("Server response:", response.text)

    # 嘗試解析 JSON 響應
    try:
        print(response.json())
    except Exception as e:
        print(f"Failed to parse JSON: {e}")


if __name__ == "__main__":
    main()
