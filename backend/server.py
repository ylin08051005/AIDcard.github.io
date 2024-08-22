from http.server import BaseHTTPRequestHandler, HTTPServer
import socket
import os

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

                # 讀圖片並且發送
                with open(latest_file_path, 'rb') as file:
                    self.send_response(200)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Content-type', 'image/jpeg')  # 根据图片类型调整 MIME 类型
                    self.end_headers()
                    self.wfile.write(file.read())
                print(f"Sent image: {latest_file}")
            except ValueError:
                self.send_response(404)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'No files found')
        else:
            print("Path is wrong!")

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler, port=8080):
    server_address = ('', port)
    ip_address = get_local_ip()
    print("The server address now is : ",ip_address,port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()