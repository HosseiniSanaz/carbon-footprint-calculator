from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
@app.route('/api/calculate-footprint', methods=['POST'])
def calculate():
    # Get the input data from the request
    input_data = request.json
    
    # Validate that request has a body
    if not input_data:
        return jsonify({'error': 'No input data provided'}), 400
    
    # Required fields
    required_fields = ['electricity', 'natural_gas', 'fuel', 'waste_amount', 
                      'recycling_percentage', 'kilometers', 'fuel_efficiency']
    
    # Check if all required fields are present
    for field in required_fields:
        if field not in input_data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
        
    # Validate all values are greater than 0 (except recycling_percentage)
    for field in required_fields:
        if field != 'recycling_percentage':
            if not isinstance(input_data[field], (int, float)) or input_data[field] < 0:
                return jsonify({'error': f'{field} must be a positive number'}), 400
    
     # Validate fuel is greater than or equal to 0
    if not (input_data['fuel'] > 0):
        return jsonify({'error': 'Fuel must be greater than 0'}), 400

    # Validate recycling_percentage is between 0 and 100
    if not (0 <= input_data['recycling_percentage'] <= 100):
        return jsonify({'error': 'Recycling percentage must be between 0 and 100'}), 400

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
