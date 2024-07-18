const apiUrl = 'http://localhost:3000';

const formularioHTML = document.getElementById("formularioLogin");
const usernameHTML = document.querySelector("[name=nombre]");
const passwordHTML = document.querySelector("[name=apellido]");
const mensajeRespuestaHTML = document.getElementById("mensajeRespuesta");

formularioHTML.addEventListener('submit', (event)=>{
    event.preventDefault();

    const username = usernameHTML.value;
    const password = passwordHTML.value;

    fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.location.href = 'admin.html';
        } else {
          loginError.textContent = data.error;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        loginError.textContent = 'Error al iniciar sesión';
      });

});