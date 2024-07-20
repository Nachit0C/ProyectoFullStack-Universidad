const apiUrl = 'http://localhost:3000';

const fetchDataButton = document.getElementById('fetchData');
const dataTable = document.getElementById('data');
const tbody = dataTable.querySelector('tbody');
const fetchError = document.getElementById('fetchError');
const createPersonaButton = document.getElementById('createPersona');
const createPersonaForm = document.getElementById('createPersonaForm');
const agregarPersonaButton = document.getElementById('botonAgregarPersona');
const cancelButton = document.getElementById('cancelButton');
const sectionIDHTML = document.getElementById('sectionID');
const leyendaFormulario = document.getElementById('leyendaFormulario');
const pErrorFormulario = document.getElementById('pErrorFormulario');

let agregaroEditar = '';
let personaEditarID = '';

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
            if (Array.isArray(data.result)) {
                data.result.forEach(person => {
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
                const newRow = document.createElement('tr');
                const noDataCell = document.createElement('td');
                noDataCell.colSpan = 5;
                noDataCell.textContent = 'Expiró el token';
                newRow.appendChild(noDataCell);
                tbody.appendChild(newRow);
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

createPersonaButton.addEventListener('click', ()=>{
    agregaroEditar = 'agregar';
    const boton = document.getElementById('botonAgregarPersona');
    sectionIDHTML.style.display = 'flex';
    leyendaFormulario.innerHTML = 'Agregar Persona';
    boton.value = 'Agregar Persona';
    createPersonaForm.scrollIntoView({ behavior: 'instant' });
});

cancelButton.addEventListener('click', ()=>{
    createPersonaForm.reset();
    sectionIDHTML.style.display = 'none';
    personaEditarID = '';
    agregaroEditar = '';
    createPersonaForm.querySelector("[name=dni]").classList.remove('invalido');
    createPersonaForm.querySelector("[name=email]").classList.remove("invalido");
    pErrorFormulario.style.display = 'none';
    fetchError.textContent = '';
});

createPersonaForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre = createPersonaForm.querySelector("[name=nombre]").value;
    const apellido = createPersonaForm.querySelector("[name=apellido]").value;
    const dni = createPersonaForm.querySelector("[name=dni]").value;
    const fecha_nacimiento = createPersonaForm.querySelector("[name=fechaNacimiento]").value;
    const email = createPersonaForm.querySelector("[name=email]").value;
    const telefono = createPersonaForm.querySelector("[name=telefono]").value;
    const direccion = createPersonaForm.querySelector("[name=direccion]").value;
    
    if(agregaroEditar === 'agregar'){

        fetch(`${apiUrl}/persona/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion})
        })
        .then(response => {
            if (!response.ok) {
                if(response.status == 405){
                    createPersonaForm.querySelector("[name=dni]").classList.add("invalido");
                    createPersonaForm.querySelector("[name=email]").classList.add("invalido");
                    pErrorFormulario.innerHTML = 'DNI o email existe en otra persona';
                    pErrorFormulario.style.display = 'block';
                }
                return response.json().then(error => { throw new Error(error.error) });
            }
    
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            // Actualiza la tabla y oculta el formulario
            fetchDataButton.click(); // Volver a cargar los datos
            sectionIDHTML.style.display = 'none';
            createPersonaForm.reset();
            createPersonaForm.querySelector("[name=dni]").classList.remove('invalido');
            createPersonaForm.querySelector("[name=email]").classList.remove("invalido");
            pErrorFormulario.style.display = 'none';
            fetchError.textContent = '';
        })
         .catch(error => {
            console.error('Error:', error);
            fetchError.textContent = 'Error al agregar persona';
        });
    }
    if(agregaroEditar === 'editar'){

        fetch(`${apiUrl}/persona/update/${personaEditarID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion})
        })
        .then(response => {
            if (!response.ok) {
                if(response.status == 405){
                    createPersonaForm.querySelector("[name=dni]").classList.add("invalido");
                    createPersonaForm.querySelector("[name=email]").classList.add("invalido");
                    pErrorFormulario.innerHTML = 'DNI o email existe en otra persona';
                    pErrorFormulario.style.display = 'block';
                }
                return response.json().then(error => { throw new Error(error.error) });
            }
    
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            // Actualiza la tabla y oculta el formulario
            fetchDataButton.click(); // Volver a cargar los datos
            sectionIDHTML.style.display = 'none';
            createPersonaForm.reset();
            personaEditarID = '';
            createPersonaForm.querySelector("[name=dni]").classList.remove('invalido');
            createPersonaForm.querySelector("[name=email]").classList.remove("invalido");
            pErrorFormulario.style.display = 'none';
            fetchError.textContent = '';
        })
         .catch(error => {
            console.error('Error:', error);
            fetchError.textContent = 'Error al agregar persona';
        });
    }
});

function handleEdit(personId) {
    const boton = document.getElementById('botonAgregarPersona');
    leyendaFormulario.innerHTML = 'Editar Persona';
    sectionIDHTML.style.display = 'flex';
    createPersonaForm.scrollIntoView({ behavior: 'instant' });
    boton.value = 'Editar Persona';
    agregaroEditar = 'editar';
    
    fetch(`${apiUrl}/persona/${personId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        createPersonaForm.querySelector("[name=nombre]").value = data.result[0].nombre;
        createPersonaForm.querySelector("[name=apellido]").value = data.result[0].apellido;
        createPersonaForm.querySelector("[name=dni]").value = data.result[0].dni;
        createPersonaForm.querySelector("[name=fechaNacimiento]").value = data.result[0].fecha_nacimiento.slice(0, 10);
        createPersonaForm.querySelector("[name=email]").value = data.result[0].email;
        createPersonaForm.querySelector("[name=direccion]").value = data.result[0].direccion;
        createPersonaForm.querySelector("[name=telefono]").value = data.result[0].telefono;

        personaEditarID = data.result[0].persona_id;
    })
    .catch(error => {
        console.error('Error:', error);
        fetchError.textContent = 'Error al editar persona';
    });
}

function handleDelete(personId) {
    console.log('Delete person with id:', personId);

    fetch(`${apiUrl}/persona/delete/${personId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.error) });
        }

        return response.json();
    })
    .then(data => {
        console.log(data.message);
        // Actualiza la tabla y oculta el formulario
        fetchDataButton.click(); // Volver a cargar los datos
        //sectionIDHTML.style.display = 'none';
        //createPersonaForm.reset();
        personaEditarID = '';
        //createPersonaForm.querySelector("[name=dni]").classList.remove('invalido');
        //createPersonaForm.querySelector("[name=email]").classList.remove("invalido");
        //pErrorFormulario.style.display = 'none';
        fetchError.textContent = '';
    })
     .catch(error => {
        console.error('Error:', error);
        fetchError.textContent = 'Error al agregar persona';
    });

}