require('dotenv').config();
const apiUrl = process.env.APIURL;

const formularioHTML = document.getElementById("formularioLogin");
const usernameHTML = document.querySelector("[name=username]");
const passwordHTML = document.querySelector("[name=password]");
const mensajeRespuestaHTML = document.getElementById("mensajeRespuesta");

formularioHTML.addEventListener('submit', (event)=>{
    event.preventDefault();

    const username = usernameHTML.value;
    const password = passwordHTML.value;

    fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.auth) {
          localStorage.setItem('token', data.token);
          window.location.href = 'tablaPersonas.html';
        } else {
            mensajeRespuestaHTML.textContent = data.message || 'Credenciales incorrectas.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        mensajeRespuestaHTML.textContent = 'Error al iniciar sesión';
      });

});