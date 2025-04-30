import os
import pandas as pd
import numpy as np
import random
from flask import Flask, request, send_file, jsonify
from kaggle.api.kaggle_api_extended import KaggleApi

app = Flask(__name__)

# Helper to download the dataset from Kaggle
def download_kaggle_dataset():
    api = KaggleApi()
    api.authenticate()
    dataset = 'fanbyprinciple/iot-device-identification'
    # Download only if not already present
    if not os.path.exists('iot_device_train.csv') or not os.path.exists('iot_device_test.csv'):
        api.dataset_download_file(dataset, 'iot_device_train.csv', path='.')
        api.dataset_download_file(dataset, 'iot_device_test.csv', path='.')
        # Unzip if needed
        import zipfile
        for fname in ['iot_device_train.csv.zip', 'iot_device_test.csv.zip']:
            if os.path.exists(fname):
                with zipfile.ZipFile(fname, 'r') as zip_ref:
                    zip_ref.extractall('.')
                os.remove(fname)

def process_data():
    # Load train and test CSVs
    df1 = pd.read_csv('iot_device_train.csv')
    df2 = pd.read_csv('iot_device_test.csv')
    df = pd.concat([df1, df2], ignore_index=True)

    # Keep only selected columns
    columns_to_keep = [
        'packet_size_avg', 'protocol', 'source_ip', 'destination_ip',
        'timestamp', 'packet_size_sum'
    ]
    filtered_df = df[[col for col in columns_to_keep if col in df.columns]]

    # Reset index and set as 'id'
    filtered_df = filtered_df.reset_index().rename(columns={'index': 'id'}).set_index('id')

    # Generate random timestamps if not present
    if 'timestamp' not in filtered_df.columns or filtered_df['timestamp'].isnull().all():
        start_date = pd.Timestamp('2023-01-01')
        end_date = pd.Timestamp('2023-12-31')
        filtered_df['timestamp'] = pd.to_datetime(
            np.random.uniform(start_date.value, end_date.value, size=len(filtered_df)), unit='ns'
        )

    # Generate random device names
    adjectives = ['smart', 'fast', 'tiny', 'silent', 'bright', 'sharp']
    nouns = ['thermo', 'tracker', 'relay', 'gateway', 'cam', 'meter']
    def generate_random_name():
        adj = random.choice(adjectives)
        noun = random.choice(nouns)
        number = random.randint(100, 999)
        return f"{adj}-{noun}-{number}"
    filtered_df['device_name'] = [generate_random_name() for _ in range(len(filtered_df))]
    filtered_df['device_id'] = filtered_df['device_name'].apply(lambda name: f"dev-{abs(hash(name)) % 100000}")

    # Save to CSV
    output_path = 'iot_data_processed.csv'
    filtered_df.to_csv(output_path)
    return output_path

@app.route('/process', methods=['GET'])
def process():
    try:
        download_kaggle_dataset()
        output_path = process_data()
        return send_file(output_path, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)