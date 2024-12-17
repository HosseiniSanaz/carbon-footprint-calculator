let footPrintResultsChart;
let footPrintResultsPieChart;

function createChart(data) {
    // Show the full report when the api response is received
    document.getElementById('foot_print_report').classList.remove('d-none');

    // Destroy existing chart if it exists
    if (footPrintResultsChart) {
        footPrintResultsChart.destroy();
    }
    if (footPrintResultsPieChart) {
        footPrintResultsPieChart.destroy();
    }
    // Show the results in the bar chart
    const ctx = document.getElementById('footPrintResultsChart');
    footPrintResultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Energy', 'Waste', 'Travel'],
            datasets: [{
                label: 'Carbon Footprint (kg CO2)',
                data: [
                    data.energy,
                    data.waste,
                    data.travel
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 206, 86)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'kg CO2'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Carbon Footprint by Category'
                }
            }
        }
    });

    // Show the results in the pie chart
    const ctxPie = document.getElementById('footPrintResultsPieChart');
    footPrintResultsPieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Energy', 'Waste', 'Travel'],
            datasets: [{
                data: [
                    data.energy,
                    data.waste,
                    data.travel
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 206, 86)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Carbon Footprint Distribution'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });


    // Add text report at the bottom of the page to show the total carbon footprint and the breakdown by category
    document.getElementById('report').innerHTML = `
        <h4>Total Carbon Footprint: <b class="text-danger">${data.total.toFixed(2)} kg CO2</b></h4>
        <div class="d-flex justify-content-between flex-column flex-md-row">
            <p>Energy: <b class="text-danger">${data.energy.toFixed(2)} kg CO2</b></p>
            <p>Waste: <b class="text-danger">${data.waste.toFixed(2)} kg CO2</b></p>
            <p>Travel: <b class="text-danger">${data.travel.toFixed(2)} kg CO2</b></p>
        </div>
    `;
}

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
        createChart(result);
    } catch (error) {
        console.log('error', error);
        alert('Error:', error);
    }
});