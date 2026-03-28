import numpy as np
from PIL import Image
import tensorflow as tf

def preprocess_image(image_content):
    img = Image.open(image_content).convert('RGB')
    img = img.resize((300, 300))
    img_array = np.array(img)
    img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array
