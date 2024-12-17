from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
@app.route('/api/calculate-footprint', methods=['POST'])
def calculate():
    # Get the input data from the request
    input_data = request.json
    
    # Calculate Energy usage based on electricity, natural_gas and fuel bills
    energy_co2 = (
        (input_data['electricity'] * 0.0005) +
        (input_data['natural_gas'] * 0.0053) +
        (input_data['fuel'] * 2.32)
    ) * 12
    
    # Calculate Waste based on waste_amount and recycling_percentage
    waste_co2 = (
        input_data['waste_amount'] * 12 * 
        (0.57 - (input_data['recycling_percentage'] / 100))
    )
    
    # Calculate Business travel based on kilometers, fuel_efficiency and fuel consumption
    travel_co2 = (
        input_data['kilometers'] * 
        (1 / input_data['fuel_efficiency']) * 
        2.31
    )
    
    # Calculate Total Carbon Footprint
    total_co2 = energy_co2 + waste_co2 + travel_co2

    # Return the results in a JSON format
    return jsonify({
        'energy': energy_co2,
        'waste': waste_co2,
        'travel': travel_co2,
        'total': total_co2
    })

if __name__ == '__main__':
    app.run(debug=True)