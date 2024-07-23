let presio = "15.000";
let canti = 1;
let cantidadBoletas = 100; // Cantidad de boletas disponibles

function btnx3() {
    document.getElementById('txtpreciorif0').innerHTML = "45.000";
    presio = "45.000";
    canti = 3;
}

function btnx6() {
    document.getElementById('txtpreciorif0').innerHTML = "75.000";
    presio = "75.000";
    canti = 5;
}

function btnx9() {
    document.getElementById('txtpreciorif0').innerHTML = "150.000";
    presio = "150.000";
    canti = 10;
}

function comprarBoleta() {
    if (presio !== null && presio !== undefined) {
        const contenedorFormulario = document.getElementById('contenedorFormulario');
        const presioForm = document.getElementById('valorBoletaForm');

        presioForm.value = presio;
        contenedorFormulario.style.display = 'block';

        cantidadBoletas -= canti; // Disminuir la cantidad de boletas disponibles
        document.getElementById('boletas-disponibles-count').innerHTML = cantidadBoletas; // Actualizar el contador
    }
}

const cerrarFormulario = document.querySelector('.cerrar-formulario');
cerrarFormulario.addEventListener('click', (event) => {
    event.preventDefault(); // Evitar que se envíe el formulario al cerrar
    const formulario = document.querySelector('.contenedor-formulario');
    formulario.style.display = 'none';
});

function generarNumerosRifa(cantidad) {
    let numerosRifa = [];
    let numerosUsados = new Set();

    while (numerosRifa.length < cantidad) {
        let numero = Math.floor(Math.random() * 100000);
        let numeroStr = numero.toString().padStart(5, '0');

        if (!numerosUsados.has(numeroStr)) {
            numerosRifa.push(numeroStr);
            numerosUsados.add(numeroStr);
        }
    }
    return numerosRifa;
}

document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email_id').value;
    const nombre = document.getElementById('from_name').value;
    const cedula = document.getElementById('cedula').value;
    const telefono = document.getElementById('telefono').value;
    const numerosRifa = generarNumerosRifa(canti);
    const valorBoleta = presio;

    let formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    formData.append('numerosRifa', numerosRifa.join(', '));
    formData.append('valorBoleta', valorBoleta);
    formData.append('cedula', cedula);
    formData.append('telefono', telefono);

    console.log("Enviando datos:", { nombre, email, numerosRifa: numerosRifa.join(', '), valorBoleta, cedula, telefono });

    // Enviar los datos a guardar_boleta.php
    fetch('guardar_boleta.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta del servidor:", data);

        if (data.status === 'success') {
            enviarCorreo(email, data.numerosRifa, valorBoleta);
            alert('Datos guardados exitosamente en la base de datos.');
        } else {
            alert('Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.');
        }
    })
    .catch(error => {
        console.error('Error al guardar los datos:', error);
        alert('Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.');
    });
});

function enviarCorreo(email, numerosRifa, valorBoleta) {
    const btn = document.getElementById('button');
    btn.value = 'Enviando...';

    const serviceID = 'default_service';
    const templateID = 'template_cydezgo';

    // Plantilla de correo para el usuario
    const templateParamsUsuario = {
        to_email: email,
        from_name: document.getElementById('from_name').value,
        email_id: document.getElementById('email_id').value,
        numerosRifa: numerosRifa.join(', '),
        valorBoleta: valorBoleta
    };

    // Plantilla de correo para el administrador
    const templateParamsAdmin = {
        to_email: 'a.initium000@gmail.com', // Tu correo personal
        from_name: document.getElementById('from_name').value,
        email_id: document.getElementById('email_id').value,
        numerosRifa: numerosRifa.join(', '),
        valorBoleta: valorBoleta
    };

    // Enviar correo al usuario
    emailjs.send(serviceID, templateID, templateParamsUsuario)
        .then(function (response) {
            console.log('Correo enviado al usuario con éxito:', response);
            btn.value = 'Enviar';
            alert('¡Gracias por tu compra! Revisa tu correo electrónico.');
        }, function (error) {
            console.error('Error al enviar el correo al usuario:', error);
            btn.value = 'Enviar';
            alert('Hubo un error al enviar el correo. Por favor, inténtalo de nuevo.');
        });

    // Enviar correo al administrador
    emailjs.send(serviceID, templateID, templateParamsAdmin)
        .then(function (response) {
            console.log('Correo enviado al administrador con éxito:', response);
        }, function (error) {
            console.error('Error al enviar el correo al administrador:', error);
        });
}


