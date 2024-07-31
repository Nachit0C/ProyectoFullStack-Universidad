/* Script que maneja el logueo del sitio */

const apiUrl = 'https://urioplata.alwaysdata.net';

const formularioHTML = document.getElementById("formularioLogin");
const usernameHTML = document.querySelector("[name=username]");
const passwordHTML = document.querySelector("[name=password]");
const mensajeRespuestaHTML = document.getElementById("mensajeRespuesta");

// Manejo de la información al enviar los datos del formulario de logueo.
formularioHTML.addEventListener('submit', (event)=>{
    event.preventDefault();
    submitLoginHandler();
});

async function submitLoginHandler(){
  // Obtengo los valores del formulario
  const username = usernameHTML.value;
  const password = passwordHTML.value;

  // Valido los campos
  if (!username || !password) {
    mensajeRespuestaHTML.textContent = 'Por favor, complete todos los campos.';
    return;
  }

  // Envío los datos al backend para autenticar login.
  try{
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al iniciar sesión');
    }

    // Obtengo la respuesta del backend.
    const data = await response.json();
    
    // Guardo el token en el local storage del navegador.
    if (data.auth) {
      localStorage.setItem('token', data.token);
      window.location.href = 'tablaPersonas.html';
    } 
    else {
        mensajeRespuestaHTML.textContent = data.message || 'Credenciales incorrectas.';
    }

  }
  catch(error){
    console.error('Error:', error);
    mensajeRespuestaHTML.textContent = 'Error al iniciar sesión: ' + error.message;
  }
}