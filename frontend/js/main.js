
document.getElementById('calculate').addEventListener('click', async () => {

    // Check if all fields are filled or not
    const fields = ['electricity', 'natural_gas', 'fuel', 'waste_amount', 'recycling_percentage', 'kilometers', 'fuel_efficiency'];
    for (const field of fields) {
        if (!document.getElementById(field).value) {
            alert('Please fill in all fields');
            return;
        }
    }

    // Check if recycling percentage is between 0 and 100
    if (document.getElementById('recycling_percentage').value > 100 || document.getElementById('recycling_percentage').value < 0) {
        alert('Recycling percentage must be between 0 and 100');
        return;
    }

    // Get data from the form
    const data = {
        electricity: parseFloat(document.getElementById('electricity').value) || 0,
        natural_gas: parseFloat(document.getElementById('natural_gas').value) || 0,
        fuel: parseFloat(document.getElementById('fuel').value) || 0,
        waste_amount: parseFloat(document.getElementById('waste_amount').value) || 0,
        recycling_percentage: parseFloat(document.getElementById('recycling_percentage').value) || 0,
        kilometers: parseFloat(document.getElementById('kilometers').value) || 0,
        fuel_efficiency: parseFloat(document.getElementById('fuel_efficiency').value) || 1
    };

    // Send data to the backend to calculate the carbon footprint
    try {
        const response = await fetch('http://127.0.0.1:5000/api/calculate-footprint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('result', result);
    } catch (error) {
        alert('Error:', error);
    }
});