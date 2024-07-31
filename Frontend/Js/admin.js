/* Script que conecta el sitio con la base de datos, realizando los manejos necesarios */

const apiUrl = 'https://urioplata.alwaysdata.net';

const fetchDataButton = document.getElementById('fetchData');
const dataTable = document.getElementById('dataPersonas');
const tbody = dataTable.querySelector('tbody');
const fetchError = document.getElementById('fetchError');
const createPersonaButton = document.getElementById('createPersona');
const createPersonaForm = document.getElementById('createPersonaForm');
const cancelButton = document.getElementById('cancelButton');
const sectionIDHTML = document.getElementById('sectionID');
const leyendaFormulario = document.getElementById('leyendaFormulario');
const pErrorFormulario = document.getElementById('pErrorFormulario');
const nuevaInscripcionButton = document.getElementById('createInscripcionButton');
const inscripcionesForm = document.getElementById('createInscripcionForm');
const cancelButtonInscipcion = document.getElementById('cancelButtonInscripcion');

// Variables auxiliares para el manejo correcto de información.
let agregaroEditarPersona = '';
let agregaroEditarInscripcion = '';
let personaEditarID = '';
let flagAlternadoPersonas = true;
let flagAlternadoInscripciones = true;
let carreraOld = '';
let inscripcionEditID = '';
let agregarInscripcionID = '';
let apellidoFetch = '';
let nombreFetch = '';

// Listas con las carreras y sedes
const carreras = ['Relaciones Internacionales', 'Comercio Internacional', 'Economía', 'Medicina', 'Psicología', 'Derecho', 'Arquitectura', 'Programación'];
const sedes = ['Economía', 'Salud', 'Derecho', 'Exactas'];

// Maneja el click al botón de traer datos.
fetchDataButton.addEventListener('click', fetchDataHandler);

// La función trae los datos de la tabla personas
async function fetchDataHandler(){
    // Obtengo el token del navegador
    const token = localStorage.getItem('token');

    if(token){
        // Envío al backend la petición de datos.
        try{
            const response = await fetch(`${apiUrl}/persona/all`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al obtener datos');
            }

            // Obtengo los datos del backend
            const data = await response.json();
            tbody.innerHTML = '';
            dataTable.style.display = 'table';

            // Voy desplegando en la tabla de personas los datos obtenidos persona a persona.
            if (Array.isArray(data.result)) {
                for (const person of data.result) {
                    // Envío datos para analizar si la persona es alumno.
                    const esAlumno = await isAlumno(person.persona_id);
                    // Creo una nueva fila para desplegar los datos de la persona.
                    const newRow = document.createElement('tr');
                    // Describo el estilo de la fila:
                    newRow.classList.add(flagAlternadoPersonas ? 'filasTablaBlanco' : 'filasTablaGris');
                    flagAlternadoPersonas = !flagAlternadoPersonas;

                    // Le agrego algunos los datos a la fila:
                    newRow.appendChild(crearCeldaBoton('Detalles', ()=> handleDetalles(person.persona_id)));
                    newRow.appendChild(crearCeldaTexto(person.apellido));
                    newRow.appendChild(crearCeldaTexto(person.nombre));
                    newRow.appendChild(crearCeldaTexto(person.dni));
                    newRow.appendChild(crearCeldaBoton('Edit', ()=> handleEdit(person.persona_id)));
                    newRow.appendChild(crearCeldaBoton('Delete', ()=> handleDelete(person.persona_id)));
                    
                    tbody.appendChild(newRow);

                    // Agreg el resto de los datos de la persona a una nueva fila:
                    const detallesFila = document.createElement('tr');
                    detallesFila.id = `detalles-${person.persona_id}`;
                    detallesFila.classList.add('filasDetallesTabla');
                    detallesFila.style.display = 'none';

                    const detallesCelda = document.createElement('td');
                    detallesCelda.colSpan = 6;
                    detallesCelda.innerHTML = `
                        <div>
                            <p><b>Fecha de nacimiento:</b> ${person.fecha_nacimiento.slice(0, 10)}</p>
                            <p><b>Email:</b> ${person.email}</p>
                            <p><b>Teléfono:</b> ${person.telefono}</p>
                            <p><b>Dirección:</b> ${person.direccion}</p>
                        </div>
                    `;

                    // Manejo de información si la persona es alumno.
                    const esAlumnoP = document.createElement('p');
                    esAlumnoP.innerHTML = (esAlumno ? "<b>Es alumno:</b> sí" : "<b>Es alumno:</b> no");
                    detallesCelda.querySelector('div').appendChild(esAlumnoP);
                    
                    if(esAlumno){
                        const inscripcionesBtn = document.createElement('button');
                        inscripcionesBtn.textContent = "Ver inscripciones";
                        inscripcionesBtn.addEventListener('click', () => botonTablaInscripcionesHandler(person.persona_id, person.apellido, person.nombre));
                        detallesCelda.querySelector('div').appendChild(inscripcionesBtn);
                    }

                    detallesFila.appendChild(detallesCelda);
                    tbody.appendChild(detallesFila);
                }
            }
            else{
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
        }
        catch(error){
            console.error('Error:', error);
            const newRow = document.createElement('tr');
            newRow.classList.add('filasTablaBlanco');
            const noDataCell = document.createElement('td');
            noDataCell.colSpan = 6;
            noDataCell.textContent = 'Expiró el token';
            newRow.appendChild(noDataCell);
            tbody.appendChild(newRow);
            dataTable.style.display = 'table';
        }
    } 
    else {
        fetchError.textContent = 'Error: No posee permisos para obtener informacion';
    }
}

// Maneja el click al botón de nueva persona.
createPersonaButton.addEventListener('click', ()=>{
    // Se configuran las variables necesarias y se despliega el formulario para ingresar los datos.
    agregaroEditarPersona = 'agregar';

    const boton = document.getElementById('botonAgregarPersona');
    sectionIDHTML.style.display = 'flex';
    leyendaFormulario.innerHTML = 'Agregar Persona';
    boton.value = 'Agregar Persona';
    createPersonaForm.scrollIntoView({ behavior: 'instant' });
});

// Maneja el click al botón de cancelar en formulario.
cancelButton.addEventListener('click', ()=>{
    // Se resetea el formulario y las variables. También se cierra el formulario.
    createPersonaForm.reset();
    sectionIDHTML.style.display = 'none';
    personaEditarID = '';
    agregaroEditarPersona = '';
    createPersonaForm.querySelector("[name=dni]").classList.remove('invalido');
    createPersonaForm.querySelector("[name=email]").classList.remove("invalido");
    pErrorFormulario.style.display = 'none';
    fetchError.textContent = '';
});

// La función maneja el click al boton de edit de una persona.
async function handleEdit(personId) {
    // Pido los datos de la persona a editar al backend.
    try{
        agregaroEditarPersona = 'editar';
        
        const boton = document.getElementById('botonAgregarPersona');
        leyendaFormulario.innerHTML = 'Editar Persona';
        sectionIDHTML.style.display = 'flex';
        createPersonaForm.scrollIntoView({ behavior: 'instant' });
        boton.value = 'Editar Persona';
        
        const response = await fetch(`${apiUrl}/persona/${personId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos de la persona');
        }

        // Obtengo los datos y los despliego en el formulario
        const data = await response.json();
        
        createPersonaForm.querySelector("[name=nombre]").value = data.result[0].nombre;
        createPersonaForm.querySelector("[name=apellido]").value = data.result[0].apellido;
        createPersonaForm.querySelector("[name=dni]").value = data.result[0].dni;
        createPersonaForm.querySelector("[name=fechaNacimiento]").value = data.result[0].fecha_nacimiento.slice(0, 10);
        createPersonaForm.querySelector("[name=email]").value = data.result[0].email;
        createPersonaForm.querySelector("[name=direccion]").value = data.result[0].direccion;
        createPersonaForm.querySelector("[name=telefono]").value = data.result[0].telefono;

        personaEditarID = data.result[0].persona_id;
    }
    catch(error) {
        console.error('Error:', error);
        fetchError.textContent = 'Error al editar persona';
    }
}

// La función maneja el click al boton de delete de una persona.
async function handleDelete(personId) {
    // Envío al backend la petición de eliminar a la persona de la tabla.
    try{
        const response = await fetch(`${apiUrl}/persona/delete/${personId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar persona');
        }
        
        const data = await response.json();
        
        // Vuelvo a cargar los datos a la tabla de personas
        console.log(data.message);
        fetchDataButton.click(); 
        personaEditarID = '';
        fetchError.textContent = '';
    }
    catch(error){
        console.error('Error:', error);
        fetchError.textContent = 'Error al agregar persona';
    }
}

// La función maneja el click al boton de detalles de una persona.
function handleDetalles(personId) {
    // Despliego los datos
    const detallesFila = document.getElementById(`detalles-${personId}`);
    detallesFila.style.display = detallesFila.style.display === 'none' ? 'table-row' : 'none';
    cancelButton.click();
}

// Maneja el click al botón de agregar persona en formulario.
createPersonaForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitFromHandle();
});

// La función maneja el envío de los datos del formulario al backend.
async function submitFromHandle(){
    // Obtengo los datos del formulario:
    const nombre = createPersonaForm.querySelector("[name=nombre]").value;
    const apellido = createPersonaForm.querySelector("[name=apellido]").value;
    const dni = createPersonaForm.querySelector("[name=dni]").value;
    const fecha_nacimiento = createPersonaForm.querySelector("[name=fechaNacimiento]").value;
    const email = createPersonaForm.querySelector("[name=email]").value;
    const telefono = createPersonaForm.querySelector("[name=telefono]").value;
    const direccion = createPersonaForm.querySelector("[name=direccion]").value;
    const esAlumnoFetch = createPersonaForm.querySelector("[name=esAlumno]:checked").value;
    let newID = '';

    try{
        // Preparo el envío de datos al backend del formulario
        let url, method_http;
        if (agregaroEditarPersona === 'agregar') {
            url = `${apiUrl}/persona/create`;
            method_http = 'POST';
        } else if (agregaroEditarPersona === 'editar') {
            url = `${apiUrl}/persona/update/${personaEditarID}`;
            method_http = 'PUT';
        }

        // Envío los datos con la configuración correspondiente.
        const response = await fetch(url, {
            method: method_http,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion})
        });

        if (!response.ok) {
            // Comunico al usuario los errores.
            if (response.status === 401) {
                createPersonaForm.querySelector("[name=dni]").classList.add("invalido");
                createPersonaForm.querySelector("[name=email]").classList.add("invalido");
                pErrorFormulario.textContent = 'DNI o email existe en otra persona';
                pErrorFormulario.style.display = 'block';
            }
            const error = await response.json();
            throw new Error(error.error);
        }

        const data = await response.json();
        console.log(data.message);
        newID = data.result.insertId;
        
        // Vuelvo a cargar los datos
        fetchDataButton.click(); 
        sectionIDHTML.style.display = 'none';
        createPersonaForm.reset();
        createPersonaForm.querySelector("[name=dni]").classList.remove('invalido');
        createPersonaForm.querySelector("[name=email]").classList.remove("invalido");
        pErrorFormulario.style.display = 'none';
        fetchError.textContent = '';

    }
    catch (error) {
        console.error('Error:', error);
        fetchError.textContent = 'Error al procesar la solicitud';
    }

    if(esAlumnoFetch == "Si"){
        createAlumno(newID);
    }
}

// La función examina si la persona es alumno.
async function isAlumno(persona_id){
    try{
        // Pido al backend datos sobre la persona.
        const response = await fetch(`${apiUrl}/alumno/${persona_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos del alumno');
        }

        // Obtengo los datos y devuelvo un booleano con la información.
        const data = await response.json();
        return data.esAlumno;
    } 
    catch(error){
        console.error('Error:', error);
        fetchError.textContent = 'Error al leer alumno';
        return -1;
    }
}

// La función envía los datos al backend para crear un alumno en la tabla alumnos.
async function createAlumno(newId){
    // Obtengo la fecha actual.
    const dateObj = new Date();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const day = String(dateObj.getDate()).padStart(2, '0');
    const fecha_ingreso = year + "-" + month + "-" + day;

    try{
        // Envío los datos al backend para crear un nuevo alumno.
        const response = await fetch(`${apiUrl}/alumno/create/${newId}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({becado: 0, fecha_ingreso})
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        console.log("Alumno Creado", data.message);
    }
    catch(error){
        console.error('Error:', error);
        fetchError.textContent = 'Error al procesar la solicitud';
    }
}

// Maneja el click al botón de ver inscripciones de una persona.
async function botonTablaInscripcionesHandler(persona_id, apellido, nombre){
    // Configuro el html
    const tablaInscripciones = document.getElementById('tablaInscripciones');
    const caption = tablaInscripciones.querySelector('caption');
    const captionText = caption.querySelector('p');
    const tbodyInscripciones = tablaInscripciones.querySelector('tbody');

    nuevaInscripcionButton.style.display = 'block';
    
    const textoHTML =  "<b>Inscripciones de " + apellido + " " + nombre + "</b>";
    captionText.innerHTML = textoHTML;
    tablaInscripciones.style.display = 'table';

    try{
        // Envío al backend la petición para obtener los datos de las inscripciones de la persona.
        const response = await fetch(`${apiUrl}/inscripciones/${persona_id}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        // Obtengo los datos y los cargo en la tabla de inscripciones.
        const data = await response.json();
        tbodyInscripciones.innerHTML = '';

        // Cargo inscripción a inscipción si hay mas de una:
        if (Array.isArray(data.result)) {
            flagAlternadoInscripciones = true;
            for (const inscripcion of data.result) {
                // Agrego nueva fila con su estilo.
                const newRow = document.createElement('tr');

                newRow.classList.add(flagAlternadoInscripciones ? 'filasTablaBlanco' : 'filasTablaGris');
                flagAlternadoInscripciones = !flagAlternadoInscripciones;

                // Agrego los datos de la inscripción.
                newRow.appendChild(crearCeldaTexto(carreras[inscripcion.carrera_id - 1]));
                newRow.appendChild(crearCeldaTexto(sedes[inscripcion.sede_id -1]));
                newRow.appendChild(crearCeldaTexto(inscripcion.fecha_inscripcion.slice(0,10)));
                newRow.appendChild(crearCeldaBoton('Edit', ()=> handleEditInscripcion(persona_id, inscripcion.carrera_id)));
                newRow.appendChild(crearCeldaBoton('Delete', ()=> handleDeleteInscripcion(persona_id, inscripcion.carrera_id)));

                tbodyInscripciones.appendChild(newRow);
            }
        }// Si la inscripción es una sola:
        else if(data.result){
            // Agrego la fila con sus datos.
            const inscripcionData = data.result[0];

            const newRow = document.createElement('tr');

            newRow.classList.add('filasTablaBlanco');

            newRow.appendChild(crearCeldaTexto(carreras[inscripcionData.carrera_id - 1]));
            newRow.appendChild(crearCeldaTexto(sedes[inscripcionData.sede_id -1]));
            newRow.appendChild(crearCeldaTexto(inscripcionData.fecha_inscripcion.slice(0,10)));
            newRow.appendChild(crearCeldaBoton('Edit', ()=> handleEditInscripcion(persona_id, inscripcionData.carrera_id)));
            newRow.appendChild(crearCeldaBoton('Delete', ()=> handleDeleteInscripcion(persona_id, inscripcionData.carrera_id)));

            tbodyInscripciones.appendChild(newRow);
        }
        else{
            // Comunico al usuario si el alumno no posee inscripciones.
            const newRow = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.colSpan = 5;
            noDataCell.textContent = 'El alumno no tiene inscripciones';
            newRow.appendChild(noDataCell);
            tbodyInscripciones.appendChild(newRow);
        }
    }
    catch(error){
        // Comunico al usuario si el alumno no posee inscripciones.
        console.error('Error:', error);
        const newRow = document.createElement('tr');
        newRow.classList.add('filasTablaBlanco');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = 5;
        noDataCell.textContent = 'El alumno no tiene inscripciones';
        newRow.appendChild(noDataCell);
        tbodyInscripciones.appendChild(newRow);
    }

    tablaInscripciones.scrollIntoView({ behavior: 'instant' });
    agregarInscripcionID = persona_id;
    apellidoFetch = apellido;
    nombreFetch = nombre;
}

// La función maneja el click al boton de nueva inscripción.
nuevaInscripcionButton.addEventListener('click', ()=>{
    // Configuro las variables y despliego el formulario de inscripción.
    agregaroEditarInscripcion = 'agregar';

    const boton = document.getElementById('submitAgregarInscripcion');
    document.getElementById('sectionIDInscripcion').style.display = 'flex';
    document.getElementById('leyendaFormularioInscripcion').innerHTML = 'Agregar Inscripción';
    boton.value = 'Agregar Inscripción';
    inscripcionesForm.scrollIntoView({ behavior: 'instant' });
    document.getElementById('mensajeRespuestaInscripcion').style.display = 'none';
});

// La función maneja el click al boton de edit de una inscripción.
async function handleEditInscripcion(persona_id, carrera_id_actual){
    // Configuro las variables y despliego el formulario de inscripción.
    agregaroEditarInscripcion = 'editar';
        
    document.getElementById('submitAgregarInscripcion').value = 'Editar Persona'; leyendaFormularioInscripcion
    document.getElementById('leyendaFormularioInscripcion').innerHTML = 'Editar Persona';
    document.getElementById('sectionIDInscripcion').style.display = 'flex';
    inscripcionesForm.scrollIntoView({ behavior: 'instant' });
    document.getElementById('mensajeRespuestaInscripcion').style.display = 'none';
    carreraOld = carrera_id_actual;
    inscripcionEditID = persona_id;
}

// La función maneja el click al boton de delete de una inscripción.
async function handleDeleteInscripcion(persona_id, carrera_id){
    // Envío al backend la petición de eliminación de una inscripción.
    try{
        const response = await fetch(`${apiUrl}/inscripciones/delete/${persona_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({carrera_id})
        });

        if (!response.ok) {
            throw new Error('Error al eliminar persona');
        }
        
        const data = await response.json();
        
        console.log(data.message);
        botonTablaInscripcionesHandler(persona_id, apellidoFetch, nombreFetch);// Volver a cargar los datos
    }
    catch(error){
        console.error('Error:', error);
        fetchError.textContent = 'Error al agregar persona';
    }
}

// La función maneja el click al boton de cerrar tabla de inscripciones.
document.getElementById('cerrarTablaInscripciones').addEventListener('click', () => {
    // Reseteo el formulario, lo cierro y reseteo las variables.
    const tablaInscripciones = document.getElementById('tablaInscripciones');
    tablaInscripciones.style.display = 'none';
    tablaInscripciones.querySelector('caption').querySelector('p').innerHTML = '';
    tablaInscripciones.querySelector('tbody').innerHTML = '';
    nuevaInscripcionButton.style.display = 'none';
    inscripcionesForm.reset();
    document.getElementById('sectionIDInscripcion').style.display = 'none';
    carreraOld = '';
    inscripcionEditID = '';
    agregarInscripcionID = '';
    apellidoFetch = '';
    nombreFetch = '';
});

// La función maneja el click al boton agregar inscripcion.
inscripcionesForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitFromHandleInscripciones();
});

// La función maneja el envío de los datos del formulario al backend.
async function submitFromHandleInscripciones(){
    // Obtengo los datos necesarios de carrera y fecha.
    const carrera_id_num = (carreras.indexOf(inscripcionesForm.querySelector("[name=carrera]").value) +1);
    const carrera_id = carrera_id_num.toString();
    const dateObj = new Date();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const day = String(dateObj.getDate()).padStart(2, '0');
    const fecha_inscripcion = year + "-" + month + "-" + day;

    const mensajeRespuestaInscripcion = document.getElementById('mensajeRespuestaInscripcion');

    if(carrera_id_num == 0){
        mensajeRespuestaInscripcion.innerHTML = "Seleccione una carrera";
        mensajeRespuestaInscripcion.style.display = 'block';
        return;
    }

    // Configuro y envío al backend los datos para agregar o editar una inscripción.
    let url, method_http;
    let bodyObj = {};
    const persona_id = agregarInscripcionID || personaEditarID;
    try{
        if (agregaroEditarInscripcion === 'agregar') {
            url = `${apiUrl}/inscripciones/create/${persona_id}`;
            method_http = 'POST';
            bodyObj = {carrera_id, fecha_inscripcion};
        }
         else if (agregaroEditarInscripcion === 'editar') {
            url = `${apiUrl}/inscripciones/update/${persona_id}`;
            method_http = 'PUT';
            bodyObj = {old_carrera_id: carreraOld,new_carrera_id: carrera_id,fecha_inscripcion};
        }

        const response = await fetch(url, {
            method: method_http,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyObj)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }

        // Manejo de errores:
        const data = await response.json();
        console.log(data.message);
        if (response.status === 201) {
            mensajeRespuestaInscripcion.innerHTML = data.message;
            mensajeRespuestaInscripcion.style.display = 'block';
        } else {// Vuelvo a cargar los datos
            botonTablaInscripcionesHandler(persona_id, apellidoFetch, nombreFetch);
            document.getElementById('sectionIDInscripcion').style.display = 'none';
            inscripcionesForm.reset();
            mensajeRespuestaInscripcion.style.display = 'none';
            fetchError.textContent = '';
        }
    }
    catch (error) {
        console.error('Error:', error);
        fetchError.textContent = 'Error al procesar la solicitud';
    }
}

// Maneja el click al botón de cancelar en formulario.
cancelButtonInscipcion.addEventListener('click', ()=>{
    // Se resetea el formulario y las variables. También se cierra el formulario.
    inscripcionesForm.reset();
    document.getElementById('sectionIDInscripcion').style.display =  'none';
    inscripcionEditID = '';
    agregaroEditarInscripcion = '';
    fetchError.textContent = '';
    document.getElementById('mensajeRespuestaInscripcion').style.display = 'none';
});

// La función crea una nueva celda con un botón.
function crearCeldaBoton(textoBoton, onClick) {
    const celda = document.createElement('td');
    const boton = document.createElement('button');
    boton.textContent = textoBoton;
    boton.addEventListener('click', onClick);
    celda.appendChild(boton);
    return celda;
}

// La función crea una nueva celda con texto.
function crearCeldaTexto(text) {
    const celda = document.createElement('td');
    celda.textContent = text;
    return celda;
}

/*
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
    document.querySelector('footer').style.position = 'static';
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
    document.querySelector('footer').style.position = 'fixed';
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
            document.querySelector('footer').style.position = 'fixed';
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
            document.querySelector('footer').style.position = 'fixed';
        })
         .catch(error => {
            console.error('Error:', error);
            fetchError.textContent = 'Error al agregar persona';
        });
    }
});

function handleEdit(personId) {
    document.querySelector('footer').style.position = 'static';
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
        fetchDataButton.click(); // Volver a cargar los datos
        personaEditarID = '';
        fetchError.textContent = '';
    })
     .catch(error => {
        console.error('Error:', error);
        fetchError.textContent = 'Error al agregar persona';
    });

}*/