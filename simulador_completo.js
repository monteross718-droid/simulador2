
  let clientes = [];
  let creditos = [];

  let tasaInteres = 15;
  let clienteSeleccionado = null;
  let cuotaCalculada = 0;
  let montoCalculado = 0;
  let plazoCalculado = 0;
  let creditoAprobado = false;

  
//Para recuperar o mostrar información usar los métodos de la clase utilitarios, puede agregar métodos adicionales en utilitarios

 let componente = document.getElementById("parametros");
 let listaClass = componente.classList;
 listaClass.add("activa");
 listaClass.remove("activa");

 ocultarSecciones = function(){

  let secciones = document.querySelectorAll("section");
  for (let i= 0; i < secciones.length; i++){
    secciones[i].classList.remove("activa");
  }

 }

 mostrarSeccion = function (id){
    ocultarSecciones();
    document.getElementById(id).classList.add("activa");
 }

 guardarTasa = function(){
    let valor = document.getElementById("tasaInteres").value;
    let tasa = Number(valor);

    if (tasa >= 10 && tasa <= 20) {
      tasaInteres = tasa;
     document.getElementById("mensajeTasa").innerText =
        "Tasa configurada correctamente: " + tasaInteres + "%";
    } else {
        document.getElementById("mensajeTasa").innerText =
        "La tasa debe estar entre 10% y 20%";
    }
  }
    function buscarCliente(cedula) {
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            return clientes[i];
        }
    }
    return null;
    }

function guardarCliente() {
    let cedula = recuperaraTexto("Cedula").trim();
    let nombre = recuperaraTexto("Nombre").trim();
    let apellido = recuperaraTexto("Apellido").trim();
    let ingresos = recuperarFloat("Ingresos");
    let egresos = recuperarFloat("Egresos");

    let cliente = clienteSeleccionado;

    if (cliente === null) {
        cliente = buscarCliente(cedula);
    }

    if (cliente === null) {
        let nuevoCliente = {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            ingresos: ingresos,
            egresos: egresos
        };

        clientes.push(nuevoCliente);
    } else {
        cliente.nombre = nombre;
        cliente.apellido = apellido;
        cliente.ingresos = ingresos;
        cliente.egresos = egresos;
    }

    pintarClientes();
    limpiar();
    mostrarTexto("mensajeCliente", "Cliente guardado o actualizado correctamente.");
}

function pintarClientes() {
    let contenido = "";

    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i];

        contenido += "<tr>" +
            "<td>" + escaparHTML(cliente.cedula) + "</td>" +
            "<td>" + escaparHTML(cliente.nombre) + "</td>" +
            "<td>" + escaparHTML(cliente.apellido) + "</td>" +
            "<td>" + cliente.ingresos + "</td>" +
            "<td>" + cliente.egresos + "</td>" +
            '<td><button type="button" data-indice="' + i +
            '">Actualizar</button></td>' +
            "</tr>";
    }

    mostrarHTML("tablaClientes", contenido);
    let botones = document.querySelectorAll("#tablaClientes button");

for (let i = 0; i < botones.length; i++) {
    botones[i].onclick = function() {
        let indice = Number(this.dataset.indice);
        seleccionarCliente(clientes[indice].cedula);
    };
}
}
function buscarCliente(cedula) {
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            return clientes[i];
        }
    }
    return null;
}

function seleccionarCliente(cedula) {
    clienteSeleccionado = buscarCliente(cedula);

    if (clienteSeleccionado === null) {
        return;
    }

    mostrarTextoEnCaja("Cedula", clienteSeleccionado.cedula);
    mostrarTextoEnCaja("Nombre", clienteSeleccionado.nombre);
    mostrarTextoEnCaja("Apellido", clienteSeleccionado.apellido);
    mostrarTextoEnCaja("Ingresos", clienteSeleccionado.ingresos);
    mostrarTextoEnCaja("Egresos", clienteSeleccionado.egresos);

    document.getElementById("Cedula").disabled = true;
}

function limpiar() {
    mostrarTextoEnCaja("Cedula", "");
    mostrarTextoEnCaja("Nombre", "");
    mostrarTextoEnCaja("Apellido", "");
    mostrarTextoEnCaja("Ingresos", "");
    mostrarTextoEnCaja("Egresos", "");

    clienteSeleccionado = null;
    document.getElementById("Cedula").disabled = false;
    mostrarTexto("mensajeCliente", "");
}