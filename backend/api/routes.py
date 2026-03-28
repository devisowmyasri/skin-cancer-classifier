import tensorflow as tf
from .preprocess import preprocess_image
from .model_utils import build_model, CLASSES
import os

# This file can be used for more structured API routing if main.py gets too large.
# For now, everything is in main.py for simplicity in a single-file backend demo.
