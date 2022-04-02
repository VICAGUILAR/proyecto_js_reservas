
//campos del formulario
const nombreInput = document.querySelector('#nombre');
const npersonasInput = document.querySelector('#npersonas');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const eventoInput = document.querySelector('#evento');


//interfaz del usuario
const formulario = document.querySelector('#nueva-reserva');
const contenedorReservas = document.querySelector('#reservas');

let editando;

class Reservas {
    constructor() {
        this.reservas = [];
    }

    agregarReserva(reserva) {
        this.reservas = [...this.reservas, reserva];

        console.log(this.reservas);
    }

    eliminarReserva(id) {
        this.reservas = this.reservas.filter(reserva => reserva.id !== id)
    }

    editarReservas(reservaActualizada) {
        this.reservas = this.reservas.map(reserva => reserva.id === reservaActualizada.id ? reservaActualizada : reserva);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
       //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //agregar clase en base al tipo de error
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //mensaje de error
        divMensaje.textContent = mensaje;

        //agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-reserva'));

        // quitar la alerta despues de 5 segunodos
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }

    imprimirReservas({ reservas }) {
        
        this.limpiarHTML();
        
        reservas.forEach(reserva => {
            const { nombre, npersonas, telefono, fecha, hora, evento, id } = reserva;

            const divReserva = document.createElement('div');
            divReserva.classList.add('reserva', 'p-3'); //estas clases reserva y p-3 son de bootstrap se encuentran en el css
            divReserva.dataset.id = id;

            //scripting de los elementos de la reserva
            const nombreParrafo = document.createElement('h2');
            nombreParrafo.textContent = nombre;

            const npersonasParrafo = document.createElement('p');
            npersonasParrafo.innerHTML = `
                <span class= "font-weight-bolder">Número de Personas: </span> ${npersonas}
            
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class= "font-weight-bolder">Teléfono: </span> ${telefono}
            
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class= "font-weight-bolder">Fecha: </span> ${fecha}
            
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class= "font-weight-bolder">Hora: </span> ${hora}
            
            `;

            const eventoParrafo = document.createElement('p');
            eventoParrafo.innerHTML = `
                <span class= "font-weight-bolder">Evento: </span> ${evento}
            
            `;

            //Boton para eliminar reserva
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar';

            btnEliminar.onclick = () => eliminarReserva(id);

            //boton para editar reserva
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar';

            btnEditar.onclick = () => cargarEdicion(reserva);
            //Agregar los parrafos a div reserva
            divReserva.appendChild(nombreParrafo);
            divReserva.appendChild(npersonasParrafo);
            divReserva.appendChild(telefonoParrafo);
            divReserva.appendChild(fechaParrafo);
            divReserva.appendChild(horaParrafo);
            divReserva.appendChild(eventoParrafo);
            divReserva.appendChild(btnEliminar);
            divReserva.appendChild(btnEditar);

            //Agregar las reservaciónes al HTML
            contenedorReservas.appendChild(divReserva);
        })

    }

    limpiarHTML() {
        while (contenedorReservas.firstChild) {
            contenedorReservas.removeChild(contenedorReservas.firstChild)
        }
    }
}




const ui = new UI();
const administrarReservas = new Reservas();

//Registrar eventos
eventListeners();
function eventListeners() {
    nombreInput.addEventListener('input', datosReserva);
    npersonasInput.addEventListener('input', datosReserva);
    telefonoInput.addEventListener('input', datosReserva);
    fechaInput.addEventListener('input', datosReserva);
    horaInput.addEventListener('input', datosReserva);
    eventoInput.addEventListener('input', datosReserva);

    formulario.addEventListener('submit', nuevaReserva);
} 


//objeto con la información de la reservación
const reservaObj = {
    nombre: '',
    npersonas: '',
    telefono: '',
    fecha: '',
    hora: '',
    evento: ''
}


//agrega datos al objeto de reservación
function datosReserva(e) {
    reservaObj[e.target.name] = e.target.value;

}

//valida y agrega una nueva reserva a la clase de reservas
function nuevaReserva(e) {
    e.preventDefault();

    //Extraer la informacion del objeto de reserva
    const { nombre, npersonas, telefono, fecha, hora, evento } = reservaObj;

    //validar
    if (nombre === '' || npersonas === '' || telefono === '' || fecha === '' || hora === '' || evento === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    }

    if (editando) {
        swal.fire ('Reservación editada correctamente');

        //Pasar el objeto de la reserva a edicion
        administrarReservas.editarReservas({ ...reservaObj })
        

        //regresar el texto del boton a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Reserva';


        //Quitar modo edicion
        editando = false;


    } else {
        console.log('Modo nueva reserva')

        //generar un id unico
        reservaObj.id = Date.now();

        //creando una nueva reserva
        administrarReservas.agregarReserva({ ...reservaObj });

        //Mensaje de agregado correctamente
        swal.fire ('Su reservación se agrego correctamente');
    }

   

    //reiniciar objeto para la validacion
    reiniciarObjeto();
    
    //Reiniciar el formulario
    formulario.reset();

    //Mostrar el HTML de las reservas
    ui.imprimirReservas(administrarReservas);

}

function reiniciarObjeto() {
    reservaObj.nombre = '';
    reservaObj.npersonas = '';
    reservaObj.telefono = '';
    reservaObj.fecha = '';
    reservaObj.hora = '';
    reservaObj.evento = '';
}


function eliminarReserva(id) {
    //eliminar reservaciónes
    administrarReservas.eliminarReserva(id);
    //mostrar msj
    swal.fire ('La reservación se eliminó correctamente');
    // refrescar reservaciónes
    ui.imprimirReservas(administrarReservas);

}


//carga los datos y el modo edicion
function cargarEdicion(reserva) {
    const { nombre, npersonas, telefono, fecha, hora, evento, id } = reserva;

    //llenar los inputs
    nombreInput.value = nombre;
    npersonasInput.value = npersonas;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    eventoInput.value = evento;

    //llenar el objeto
    reservaObj.nombre = nombre;
    reservaObj.npersonas = npersonas;
    reservaObj.telefono = telefono;
    reservaObj.fecha = fecha;
    reservaObj.hora = hora;
    reservaObj.evento = evento;
    reservaObj.id = id;

    //cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;

}

//Uso de API de google

function iniciarMap(){
    var coord = {lat: 16.73577962763676 ,lng: -92.63819421567194};
    var map = new google.maps.Map(document.getElementById('map'),{
      zoom: 10,
      center: coord
    });
    var marker = new google.maps.Marker({
      position: coord,
      map: map
    });
}


