import os
from kaggle.api.kaggle_api_extended import KaggleApi
import zipfile

def download_kaggle_dataset():
    api = KaggleApi()
    api.authenticate()
    dataset = 'fanbyprinciple/iot-device-identification'
    
    if not os.path.exists('iot_device_train.csv') or not os.path.exists('iot_device_test.csv'):
        api.dataset_download_file(dataset, 'iot_device_train.csv', path='.')
        api.dataset_download_file(dataset, 'iot_device_test.csv', path='.')
        
        for fname in ['iot_device_train.csv.zip', 'iot_device_test.csv.zip']:
            if os.path.exists(fname):
                with zipfile.ZipFile(fname, 'r') as zip_ref:
                    zip_ref.extractall('.')
                os.remove(fname)
