import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from .model_utils import build_model, IMG_SIZE
import os

# Dummy training script for HAM10000
# Usage: python -m backend.ml.train

def train_model(data_dir, epochs=20, batch_size=32):
    model = build_model()
    
    # Optimizer & Loss
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss='categorical_all_entropy', # Simplified placeholder
        metrics=['accuracy']
    )
    
    # Data Augmentation
    datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )
    
    # Needs actual HAM10000 data structure
    # train_generator = datagen.flow_from_directory(...)
    
    print("Training script initialized. Please provide HAM10000 dataset paths.")
    # model.fit(...)
    
    # Save results
    os.makedirs('backend/ml/weights', exist_ok=True)
    # model.save('backend/ml/weights/model.h5')

if __name__ == "__main__":
    train_model("path/to/ham10000")
