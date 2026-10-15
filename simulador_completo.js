
  let clientes = [];
  let creditos = [];

  let tasaInteres = 15;
  let clienteSeleccionado = null;
  let cuotaCalculada = 0;
  let montoCalculado = 0;
  let plazoCalculado = 0;
  let creditoAprobado = false;
  let clienteCredito = null;

  
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

function buscarClienteCredito() {
    let cedula = recuperaraTexto("buscarCedulaCredito").trim();
    clienteCredito = buscarCliente(cedula);

    mostrarTexto("resultadoCredito", "");
    document.getElementById("resultadoCredito").className = "";
    document.getElementById("btnSolicitarCredito").disabled = true;
    creditoAprobado = false;

    if (clienteCredito === null) {
        mostrarTexto("datosClienteCredito", "Cliente no encontrado.");
        return;
    }

    let contenido =
        "<h3>Datos del Cliente</h3>" +
        "<p><strong>Cédula:</strong> " +
        escaparHTML(clienteCredito.cedula) + "</p>" +
        "<p><strong>Nombre:</strong> " +
        escaparHTML(clienteCredito.nombre) + "</p>" +
        "<p><strong>Apellido:</strong> " +
        escaparHTML(clienteCredito.apellido) + "</p>" +
        "<p><strong>Ingresos:</strong> $" +
        clienteCredito.ingresos + "</p>" +
        "<p><strong>Egresos:</strong> $" +
        clienteCredito.egresos + "</p>";

    mostrarHTML("datosClienteCredito", contenido);
}

function buscarClienteCredito() {
    
    let cedula = recuperaraTexto("buscarCedulaCredito").trim();
    document.getElementById("btnSolicitarCredito").disabled = true;

    clienteSeleccionado = buscarCliente(cedula);

    mostrarHTML("resultadoCredito", "");
    document.getElementById("resultadoCredito").className = "";
    creditoAprobado = false;

    if (clienteSeleccionado === null) {
        mostrarTexto("datosClienteCredito", "Cliente no encontrado.");
        return;
    }

    let contenido = `
        <h3>Datos del Cliente</h3>
        <p><strong>Cédula:</strong>
            ${escaparHTML(clienteSeleccionado.cedula)}</p>
        <p><strong>Nombre:</strong>
            ${escaparHTML(clienteSeleccionado.nombre)}</p>
        <p><strong>Apellido:</strong>
            ${escaparHTML(clienteSeleccionado.apellido)}</p>
        <p><strong>Ingresos:</strong>
            ${clienteSeleccionado.ingresos}</p>
        <p><strong>Egresos:</strong>
            ${clienteSeleccionado.egresos}</p>
    `;

    mostrarHTML("datosClienteCredito", contenido);
}

function calcularDisponible(ingresos, egresos) {
    let disponible = ingresos - egresos;

    if (disponible < 0) {
        return 0;
    }

    return disponible;
}

function calcularCapacidadPago(montoDisponible) {
    return montoDisponible * 0.5;
}

function calcularInteresSimple(monto, tasa, plazoAnios) {
    return monto * (tasa / 100) * plazoAnios;
}

function calcularCuotaMensual(total, plazoAnios) {
    return total / (plazoAnios * 12);
}

function calcularCredito() {
    let resultadoCredito = document.getElementById("resultadoCredito");
    document.getElementById("btnSolicitarCredito").disabled = true;

    resultadoCredito.className = "";
    creditoAprobado = false;

    if (clienteSeleccionado === null) {
        mostrarTexto("resultadoCredito", "Primero buscar un cliente.");
        return;
    }

    let monto = recuperarFloat("montoCredito");
    let plazoAnios = recuperarFloat("plazoCredito");

    if (!Number.isFinite(monto) || monto <= 0 ||
        !Number.isFinite(plazoAnios) || plazoAnios <= 0) {
        mostrarTexto(
            "resultadoCredito",
            "Ingresar un monto y un plazo mayores que cero. Plazo en años."
        );
        return;
    }

    let ingresos = Number(clienteSeleccionado.ingresos);
    let egresos = Number(clienteSeleccionado.egresos);

    if (!Number.isFinite(ingresos) || ingresos < 0 ||
        !Number.isFinite(egresos) || egresos < 0) {
        mostrarTexto(
            "resultadoCredito",
            "Revisar los ingresos y egresos del cliente."
        );
        return;
    }

    let disponible = calcularDisponible(ingresos, egresos);
    let capacidadPago = calcularCapacidadPago(disponible);

    let interes = calcularInteresSimple(monto, tasaInteres, plazoAnios);
    let totalPagar = monto + interes;

    cuotaCalculada = calcularCuotaMensual(totalPagar, plazoAnios);
    montoCalculado = monto;
    plazoCalculado = plazoAnios;

    creditoAprobado = cuotaCalculada <= capacidadPago;
    document.getElementById("btnSolicitarCredito").disabled = !creditoAprobado;

    let resultado;

    if (creditoAprobado) {
        resultado = "APROBADO";
        resultadoCredito.className = "aprobado";
    } else {
        resultado = "RECHAZADO";
        resultadoCredito.className = "rechazado";
    }

    resultadoCredito.innerHTML = `
        Capacidad de pago: ${capacidadPago.toFixed(2)}<br>
        Total a pagar: ${totalPagar.toFixed(2)}<br>
        Cuota mensual: ${cuotaCalculada.toFixed(2)}<br>
        RESULTADO: ${resultado}
    `;
}