from app import create_app
from dotenv import load_dotenv
import os
app = create_app()
load_dotenv()
PORT = os.getenv('PORT');

if __name__ == '__main__':
    app.run(debug=True,port= PORT, ssl_context=('./cert/cert.pem', './cert/key.pem'))
    # app.run(debug=True, port=PORT, ssl_context=('cert.pem', 'key.pem'))
