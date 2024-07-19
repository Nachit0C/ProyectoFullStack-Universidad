const apiUrl = 'http://localhost:3000';

const formularioHTML = document.getElementById("formularioRegistro");
const nombreHTML = document.querySelector("[name=nombre]");
const apellidoHTML = document.querySelector("[name=apellido]");
const dniHTML = document.querySelector("[name=dni]");
const fecha_nacimientoHTML = document.querySelector("[name=fechaNacimiento]");
const emailHTML = document.querySelector("[name=email]");
const telefonoHTML = document.querySelector("[name=telefono]");
const direccionHTML = document.querySelector("[name=direccion]");
const mensajeRespuestaHTML = document.getElementById("mensajeRespuesta");

formularioHTML.addEventListener('submit', (event)=>{
    event.preventDefault();

    const token = localStorage.getItem('token');
    const nombre = nombreHTML.value;
    const apellido = apellidoHTML.value;
    const dni = dniHTML.value;
    const fecha_nacimiento = fecha_nacimientoHTML.value;
    const email = emailHTML.value;
    const telefono = telefonoHTML.value;
    const direccion = direccionHTML.value;

    fetch(`${apiUrl}/persona/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, apellido, dni, fecha_nacimiento, email, telefono, direccion})
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.error) });
        }

        return response.json();
    }).then(data => {
        console.log(data.message);
        mensajeRespuestaHTML.textContent = data.message;
        mensajeRespuestaHTML.style.color = "green";
        //formularioHTML.reset();
    })
    .catch(error => {
        console.error('Error:', error.message);
        mensajeRespuestaHTML.textContent = error.message;
        mensajeRespuestaHTML.style.color = "red";
    });
});