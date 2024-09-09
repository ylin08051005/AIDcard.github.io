from PIL import Image
from torchvision import transforms
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer
from IPython.display import clear_output
import time
import os
import matplotlib.pyplot as plt
import torch
from torchvision import datasets, transforms
from classification_model.vgg16 import VGG16
    

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
])

class_name = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

model = VGG16

def predict_class(img_path):
    if not os.path.exists(img_path) :
        print("這個路徑沒有圖片！辨識模型並沒有讀取到圖片！")
        return
    
    img = Image.open(img_path).convert('RGB')
    input_tensor = transform(img)
    input_tensor = input_tensor.unsqueeze(0)

    model.eval()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    input_tensor = input_tensor.to(device)


    with torch.no_grad():
        prediction = VGG16(input_tensor)
        _, predicted_class = torch.max(prediction,1)

    predicted_class_name = class_name[predicted_class.item()]
    return predicted_class.item(), predicted_class_name


if __name__ == "__main__" :
    predict_dir_path = r"backend\received_imgs"
    print(os.path.exists(predict_dir_path))

    img_path = r"backend\received_imgs\received_image.jpg"
    predict_class(img_path)