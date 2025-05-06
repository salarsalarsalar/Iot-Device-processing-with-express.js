from flask import Blueprint, send_file, jsonify
from .kaggle_helper import download_kaggle_dataset
from .processing import process_data

process_bp = Blueprint('process', __name__)

@process_bp.route('/process', methods=['GET'])
def process():
    try:
        download_kaggle_dataset()
        output_path = process_data()
        return send_file(output_path, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
