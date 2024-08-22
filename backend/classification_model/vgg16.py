import torch
# from torchvision import models
from torchvision.models import vgg16, VGG16_Weights

import torch.nn as nn
import os


# VGG16 = models.vgg16(pretrained=True)
VGG16 = vgg16(weights=VGG16_Weights.IMAGENET1K_V1)

num_features = VGG16.classifier[6].in_features
VGG16.classifier[6] = nn.Linear(num_features, 6)

weight_path = r"backend\classification_model\model_weights.pth"
# print(os.path.exists(weight_path))
if os.path.exists(weight_path):
    model_weight = torch.load(weight_path, map_location=torch.device('cpu'))
    VGG16.load_state_dict(model_weight)
else :
    print("You didn't put the weight file in the model dictionary. And now will use the original VGG16 didn't trained.")