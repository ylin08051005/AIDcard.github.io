from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return "Hello, Flask is running!", 200

@app.route('/receive_images', methods=['POST'])
def receive_images():
    data = request.get_json()
    image_urls = data.get('image_urls', [])
    label = data.get('label', 'unknown')

    # 將 image_urls 和 label 儲存到伺服器或做其他處理
    print(f'Received {len(image_urls)} images with label: {label}')

    return jsonify({"message": "Images received successfully", "count": len(image_urls)})

if __name__ == '__main__':
    app.run(port=5000)
