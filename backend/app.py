from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
@app.route('/api/mock-data', methods=['GET'])
def get_mock_data():
    return jsonify({"message": "Hello Developer!"})

if __name__ == '__main__':
    app.run(debug=True)