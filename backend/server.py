from http.server import BaseHTTPRequestHandler, HTTPServer
from classification_model import predict
import socket
import os
import json
import base64


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception as e:
        ip = "無法得到 IP 位址!"
        print(f"錯誤: {e}")
    finally:
        s.close()

    return ip

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        # 指定保存文件的資料夾路徑
        save_directory = r"backend\received_imgs"# 替換為你想要保存文件的路徑
        os.makedirs(save_directory, exist_ok=True)  # 如果資料夾不存在，則創建

        # 指定文件名稱（假設每次上傳保存為 received_image.jpg）
        file_path = os.path.join(save_directory, "received_image.jpg")

        # 保存文件
        with open(file_path, "wb") as file:
            file.write(post_data)

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'File received successfully')

    def do_GET(self):
        if self.path == r'/check-new-image':
            save_directory = r"backend\received_imgs"  # 确保这个路径是正确的，并且存在

            try:
                # 找最新的檔案
                latest_file = max([f for f in os.listdir(save_directory)], key=lambda x: os.path.getmtime(os.path.join(save_directory, x)))
                latest_file_path = os.path.join(save_directory, latest_file)

                # 使用 predict_class 函數取得分類結果
                class_num, class_name = predict.predict_class(latest_file_path)

                # 讀取並編碼圖片
                with open(latest_file_path, 'rb') as image_file:
                    encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

                # 準備回傳的數據
                response_data = {
                    "file_name": latest_file,
                    "class_name": class_name,
                    "class_num": class_num,
                    "image_data": encoded_image
                }
                
                # 將數據轉換為 JSON 並返回
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode('utf-8'))

            except ValueError:
                self.send_response(404)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'No files found')
        else:
            self.send_response(404)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'Path is wrong!')

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler, port=8080):
    server_address = ('', port)
    ip_address = get_local_ip()
    print("The server address now is : ",ip_address,port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()