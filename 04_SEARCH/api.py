import os
import uvicorn
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from PIL import Image
import numpy as np
from predictor import predictor
import cv2 as cv2
import io
import rarfile
from dotenv import load_dotenv
import requests
import pandas as pd
from keras.applications import ResNet50
from keras.preprocessing import image
from keras.applications.resnet50 import preprocess_input
from keras.models import Model
from keras.layers import Input
from scipy.spatial.distance import cosine

load_dotenv(encoding='utf-8')  # Load environment variables from .env file

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hi, thanks used me for your DATN ^_^"}

# Function to build Siamese Model using ResNet50
def build_siamese_model(input_shape):
    base_model = ResNet50(weights='imagenet', include_top=False, pooling='avg')
    input = Input(shape=input_shape)
    processed = base_model(input)
    model = Model(inputs=input, outputs=processed)
    return model

# Function to load and preprocess image
def load_and_preprocess_image(img_data, target_size=(224, 224)):
    img_pil = Image.open(io.BytesIO(img_data))
    img_array = image.img_to_array(img_pil.resize(target_size))
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

# Function to compute similarity
def compute_similarity(feature_vector1, feature_vector2):
    return 1 - cosine(feature_vector1, feature_vector2)

@app.post("/image-search")
async def image_search(image: UploadFile = File(...)):
    print("Image search endpoint hit")
    image_data = await image.read()
    img_array = load_and_preprocess_image(image_data)

    store_path = "image"
    if not os.path.exists(store_path):
        os.makedirs(store_path)
        
    file_name = image.filename
    dst_path = os.path.join(store_path, file_name)
    
    image_pil = Image.open(io.BytesIO(image_data))
    img = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)
    if img is not None and img.size != 0:
        cv2.imwrite(dst_path, img)
        print("Image saved at:", dst_path)
    else:
        print("Empty or invalid image array.")

    # Save the image data to compare later
    global search_image_data
    search_image_data = img_array

    base_path = os.getenv('BASE_PATH')
    rar_file_name = os.getenv('RAR_FILE_NAME')
    csv_file_name = os.getenv('CSV_FILE_NAME')
    
    if not base_path or not rar_file_name or not csv_file_name:
        raise HTTPException(status_code=500, detail="Missing environment variable configurations")

    csv_path = Path(base_path) / csv_file_name
    rar_path = Path(base_path) / rar_file_name
 
    # Extract h5.rar to get Search.h5
    if not rar_path.exists():
        raise HTTPException(status_code=404, detail=f"File not found: {rar_path}")
    
    try:
        with rarfile.RarFile(rar_path) as rf:
            rf.extract('Search.h5', base_path)
    except rarfile.RarCannotExec as e:
        raise HTTPException(status_code=500, detail=f"Error extracting RAR file: {e}")

    model_path = Path(base_path) / 'Search.h5'
    if not model_path.exists():
        raise HTTPException(status_code=404, detail=f"Extracted file not found: {model_path}")

    # Read the CSV file with utf-8 encoding
    try:
        df = pd.read_csv(csv_path, encoding='utf-8')
        print("CSV file loaded successfully. First few rows:")
        print(df.head())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading CSV file: {e}")
    
    

    klass, prob, img, df = predictor(store_path, csv_path, model_path, averaged=True, verbose=False)
    print(klass)
    print(f'{prob * 100: 6.2f}')
    
    if store_path is not None:
        for filename in os.listdir(store_path):
            file_path = os.path.join(store_path, filename)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                print(f"Không thể xóa tệp {file_path}: {e}")
    return klass

@app.post("/product-analysis")
async def product_analysis(images: List[str]):
    print("Product analysis endpoint hit")

    input_shape = (224, 224, 3)
    siamese_model = build_siamese_model(input_shape)

    analyzed_results = []

    for image_url in images:
        # Download the image
        response = requests.get(image_url)
        image_data = response.content
        img_array = load_and_preprocess_image(image_data)
        
        # Predict using the Siamese model
        search_feature_vector = siamese_model.predict(search_image_data).flatten()
        img_feature_vector = siamese_model.predict(img_array).flatten()
        
        similarity = compute_similarity(search_feature_vector, img_feature_vector)
        percent_similarity = similarity * 100
        
        analyzed_results.append({
            "image": image_url,
            "similarity": percent_similarity
        })
    
    # Sort analyzed_results based on similarity in descending order
    analyzed_results.sort(key=lambda x: x["similarity"], reverse=True)
    
    return analyzed_results

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
