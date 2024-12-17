
document.getElementById('calculate').addEventListener('click', async () => {
   
    try {
        const response = await fetch('http://127.0.0.1:5000/api/mock-data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const result = await response.json();
        console.log(result);
        alert(result.message);
    } catch (error) {
        console.error('Error:', error);
    }
});