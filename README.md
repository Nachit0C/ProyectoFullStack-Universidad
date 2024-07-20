# ProyectoFullStack-Universidad

Este es un proyecto realizado como TPO para el curso de CodoaCodo de FullStack en Node.js
En dónde se simula un sitio web de una universidad que dicta distintas carreras en distintas sedes.
La finalidad del proyecto fue aprender y demostrar los conocimientos adquiridos durante el curso.


# Composición:

El sitio está compuesto por 4 páginas navegables (y 8 páginas mas de cada una de las carreras):

* Index:
  
   Esta es la página principal que consiste en una sección hero y un contenido principal con links a las páginas de las carreras.
* Sedes:
  
  Aqui se encuentran las 4 sedes, con información de las mismas y un iframe de google maps de cada una.
* Login:
  
  Desde esta página se loguea como administrador para ver y modificar la página de tablaPersonas.
* tablasPersonas:
  
  Esta página disponible solo para el administrador, cuenta con las herramientas para ver y manipular la base de datos.

#  Funcionalidad:

Las páginas Index y Sedes son páginas estáticas y no tienen una funcionalidad extra.
La página Login tiene un pequeño formulario para ingresar como administrador. Que sólo acepta las credenciales preexistentes hechas por los desarrolladores (username: admin, password: admin123, dejo las credenciales en público confiando de la buenavoluntad de los que deseen interactuar con el sitio).
Desde allí se genera un token a través de JWT con una password encriptada por bcrypt la cual se guarda en el local storage del navegador, y luego redirige hacia la página de tablaPersonas.
Desde allí, el usuario puede desplegar la tabla de personas guardada en una base de datos MySQL, dándo la opción de editar alguna persona, eliminarla y agregar una nueva persona. Para agregar o editar una persona, se despliega un formulario para llenar con los nuevos datos.
Todo está conectado con un backend a través de una API REST desarrollado en su totalidad con Node.js y Express.js

# En desarrollo:

Por lo pronto, el proximo paso en la tabla consiste en el desarrollo de la conexión al resto de las tablas de la base de datos (tabla de alumnos y tabla de inscripciones). Se modificará el front para poder acceder y realizar el CRUD para ambas tablas.
