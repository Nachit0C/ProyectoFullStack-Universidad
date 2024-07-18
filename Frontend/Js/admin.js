const apiUrl = 'http://localhost:3000';

const fetchDataButton = document.getElementById('fetchData');
const dataDiv = document.getElementById('data');
const fetchError = document.getElementById('fetchError');

fetchDataButton.addEventListener('click', () => {
    
    if(localStorage.getItem('admin') === 'true'){
        fetch(`${apiUrl}/persona/all`, {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            dataDiv.innerHTML = ''; // Clear previous data
            /*dataDiv.textContent = JSON.stringify(data);
            fetchError.textContent = '';*/
            if (Array.isArray(data)) {
                data.forEach(person => {
                    const personDiv = document.createElement('div');
                    personDiv.textContent = `Nombre: ${person.nombre}, Apellido: ${person.apellido}, DNI: ${person.dni}, Email: ${person.email}`;
                    dataDiv.appendChild(personDiv);
                });
            } else {
                dataDiv.textContent = 'No se encontraron personas';
            }
            fetchError.textContent = '';
        })
        .catch(error => {
            console.error('Error:', error);
            fetchError.textContent = 'Error al obtener datos';
        });
    } else {
        fetchError.textContent = 'Error: No posee permisos para obtener informacion';
    }
});