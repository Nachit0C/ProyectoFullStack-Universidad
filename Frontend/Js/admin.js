const apiUrl = 'http://localhost:3000';

const fetchDataButton = document.getElementById('fetchData');
const dataDiv = document.getElementById('data');
const fetchError = document.getElementById('fetchError');

fetchDataButton.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    
    if(token){
        fetch(`${apiUrl}/persona/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            dataDiv.innerHTML = ''; // Limpio data vieja
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