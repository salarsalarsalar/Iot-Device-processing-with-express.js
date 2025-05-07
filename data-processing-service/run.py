from app import create_app
from dotenv import load_dotenv
import os
app = create_app()
load_dotenv()
PORT = os.getenv('PORT');

if __name__ == '__main__':
    app.run(debug=True,port= PORT)
