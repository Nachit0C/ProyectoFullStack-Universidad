const apiUrl = 'http://localhost:3000';

const fetchDataButton = document.getElementById('fetchData');
const dataTable = document.getElementById('data');
const tbody = dataTable.querySelector('tbody');
const fetchError = document.getElementById('fetchError');
const createPersonaButton = document.getElementById('createPersona');

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
            tbody.innerHTML = '';
            dataTable.style.display = 'table';
            if (Array.isArray(data)) {
                data.forEach(person => {
                    const newRow = document.createElement('tr');
                    
                    const apellido = document.createElement('td');
                    apellido.textContent = person.apellido;
                    newRow.appendChild(apellido);

                    const nombre = document.createElement('td');
                    nombre.textContent = person.nombre;
                    newRow.appendChild(nombre);

                    const dni = document.createElement('td');
                    dni.textContent = person.dni;
                    newRow.appendChild(dni);

                    const edit = document.createElement('td');
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.addEventListener('click', () => {
                        handleEdit(person.persona_id);
                    });
                    edit.appendChild(editButton);
                    newRow.appendChild(edit);

                    const deletetd = document.createElement('td');
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () =>{
                        handleDelete(person.persona_id);
                    });
                    deletetd.appendChild(deleteButton);
                    newRow.appendChild(deletetd);


                    tbody.appendChild(newRow);
                });
            } else {
                dataTable.createElement('h1').textContent = 'No se encontraron personas';
            }
            fetchDataButton.style.display = 'none';
            createPersonaButton.style.display = 'block';
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

function handleEdit(personId) {
    // Lógica para editar la persona
    console.log('Edit person with id:', personId);
    // Aquí puedes abrir un formulario de edición y enviar una solicitud de actualización al backend
}

function handleDelete(personId) {
    // Lógica para eliminar la persona
    console.log('Delete person with id:', personId);

}