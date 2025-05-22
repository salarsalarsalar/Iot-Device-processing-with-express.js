import pandas as pd
import numpy as np
import random

def process_data():
    df1 = pd.read_csv('iot_device_train.csv')
    df2 = pd.read_csv('iot_device_test.csv')
    df = pd.concat([df1, df2], ignore_index=True)

    columns_to_keep = [
        'packet_size_avg', 'protocol', 'source_ip', 'destination_ip',
        'timestamp', 'packet_size_sum'
    ]
    filtered_df = df[[col for col in columns_to_keep if col in df.columns]]

    filtered_df = filtered_df.reset_index().rename(columns={'index': 'id'}).set_index('id')

    if 'timestamp' not in filtered_df.columns or filtered_df['timestamp'].isnull().all():
        start_date = pd.Timestamp('2023-01-01')
        end_date = pd.Timestamp('2023-12-31')
        filtered_df['timestamp'] = pd.to_datetime(
            np.random.uniform(start_date.value, end_date.value, size=len(filtered_df)), unit='ns'
        )

    adjectives = ['smart', 'fast', 'tiny', 'silent', 'bright', 'sharp']
    nouns = ['thermo', 'tracker', 'relay', 'gateway', 'cam', 'meter']
    def generate_random_name():
        return f"{random.choice(adjectives)}-{random.choice(nouns)}-{random.randint(100, 999)}"

    filtered_df['device_name'] = [generate_random_name() for _ in range(len(filtered_df))]
    filtered_df['device_id'] = filtered_df['device_name'].apply(lambda name: f"dev-{abs(hash(name)) % 100000}")

    output_path = 'iot_data_processed.csv'
    filtered_df.to_csv(output_path)
    return output_path
