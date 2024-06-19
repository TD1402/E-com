import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import cv2
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt

class CustomDepthwiseConv2D(tf.keras.layers.DepthwiseConv2D):
    def __init__(self, **kwargs):
        kwargs.pop('groups', None)
        super(CustomDepthwiseConv2D, self).__init__(**kwargs)

def custom_objects_dict():
    return {
        'DepthwiseConv2D': CustomDepthwiseConv2D,
    }

def predictor(sdir, csv_path, model_path, averaged=True, verbose=True):
    # Load the CSV file with UTF-8 encoding
    class_df = pd.read_csv(csv_path, encoding='utf-8')
    class_count = len(class_df['class'].unique())
    img_height = int(class_df['height'].iloc[0])
    img_width = int(class_df['width'].iloc[0])
    img_size = (img_width, img_height)
    scale = class_df['scale by'].iloc[0]
    image_list = []

    try:
        s = int(scale)
        s2 = 1
        s1 = 0
    except:
        split = scale.split('-')
        s1 = float(split[1])
        s2 = float(split[0].split('*')[1])

    path_list = []
    paths = os.listdir(sdir)
    for f in paths:
        path_list.append(os.path.join(sdir, f))

    if verbose:
        print('Model is being loaded - this will take about 10 seconds')
    model = load_model(model_path, custom_objects=custom_objects_dict())
    print(path_list)

    image_count = len(path_list)
    image_list = []
    file_list = []
    good_image_count = 0

    for i in range(image_count):
        try:
            img = cv2.imread(path_list[i])
            img = cv2.resize(img, img_size)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            good_image_count += 1
            img = img * s2 - s1
            image_list.append(img)
            file_name = os.path.split(path_list[i])[1]
            file_list.append(file_name)
        except:
            if verbose:
                print(path_list[i], 'is an invalid image file')

    if good_image_count == 1:
        averaged = True

    image_array = np.array(image_list)
    preds = model.predict(image_array)

    if averaged:
        psum = [0] * class_count
        for p in preds:
            for i in range(class_count):
                psum[i] += p[i]
        index = np.argmax(psum)
        klass = class_df['class'].iloc[index]
        prob = psum[index] / good_image_count
        for img in image_array:
            test_img = np.expand_dims(img, axis=0)
            test_index = np.argmax(model.predict(test_img))
            if test_index == index:
                if verbose:
                    plt.axis('off')
                    plt.imshow(img)
                    print(f'Predicted species is {klass} with a probability of {prob:6.4f}')
                break
        return klass, prob, img, None
    else:
        pred_class = []
        prob_list = []
        for i, p in enumerate(preds):
            index = np.argmax(p)
            klass = class_df['class'].iloc[index]
            image_file = file_list[i]
            pred_class.append(klass)
            prob_list.append(p[index])
        Fseries = pd.Series(file_list, name='image file')
        Lseries = pd.Series(pred_class, name='species')
        Pseries = pd.Series(prob_list, name='probability')
        df = pd.concat([Fseries, Lseries, Pseries], axis=1)
        if verbose:
            length = len(df)
            print(df.head(length))
        return None, None, None, df
