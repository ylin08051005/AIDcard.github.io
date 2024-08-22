import torch
import torchvision
import torchvision.transforms as transforms
from torchvision import datasets
from torch.utils.data import DataLoader
from torchvision import models
import torch.nn as nn
import torch.optim as optim


VGG16 = models.vgg16(pretrained=True)
num_features = VGG16.classifier[6].in_features
VGG16.classifier[6] = nn.Linear(num_features, 6)

model_weight_path = r"backend\classification_model\model_weights.pth"
model_weight = torch.load(model_weight_path, map_location=torch.device('cpu'))
VGG16.load_state_dict(model_weight)