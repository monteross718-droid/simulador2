
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
 // Mostrar Parámetros al abrir la página.

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
      invalidarCredito();
    
     document.getElementById("mensajeTasa").innerText =
        "Tasa configurada correctamente: " + tasaInteres + "%";
    } else {
        document.getElementById("mensajeTasa").innerText =
        "La tasa debe estar entre 10% y 20%";
    }
  }
function guardarCliente() {
    let cedula = recuperaraTexto("Cedula").trim();
    let nombre = recuperaraTexto("Nombre").trim();
    let apellido = recuperaraTexto("Apellido").trim();
    let ingresos = recuperarFloat("Ingresos");
    let egresos = recuperarFloat("Egresos");

    if (!cedula || !nombre || !apellido ||
        !Number.isFinite(ingresos) || ingresos < 0 ||
        !Number.isFinite(egresos) || egresos < 0) {
        mostrarTexto("mensajeCliente", "Complete cédula, nombre y apellido; ingresos y egresos deben ser números no negativos.");
        return;
    }

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

    invalidarCredito();
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

// Cliente de la solicitud, separado del cliente que se está editando.
function buscarClienteCredito() {
    invalidarCredito();
    clienteCredito = buscarCliente(recuperaraTexto("buscarCedulaCredito").trim());
    if (clienteCredito === null) {
        mostrarTexto("datosClienteCredito", "Cliente no encontrado.");
        return;
    }
    mostrarHTML("datosClienteCredito", `
        <h3>Datos del Cliente</h3>
        <p>Cédula: ${escaparHTML(clienteCredito.cedula)}</p>
        <p class="error-campo" id="error_cliente_cedula" aria-live="polite"></p>
        <p>Nombre: ${escaparHTML(clienteCredito.nombre)} ${escaparHTML(clienteCredito.apellido)}</p>
        <p class="error-campo" id="error_cliente_nombre" aria-live="polite"></p>
        <p class="error-campo" id="error_cliente_apellido" aria-live="polite"></p>
        <p>Ingresos: $${clienteCredito.ingresos}</p>
        <p class="error-campo" id="error_cliente_ingresos" aria-live="polite"></p>
        <p>Egresos: $${clienteCredito.egresos}</p>
        <p class="error-campo" id="error_cliente_egresos" aria-live="polite"></p>
    `);
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
    mostrarTexto("mensajeAsignacion", "");
    let resultadoCredito = document.getElementById("resultadoCredito");
    document.getElementById("btnSolicitarCredito").disabled = true;

    resultadoCredito.className = "";
    creditoAprobado = false;

    // Reúne todos los errores antes de decidir si se puede calcular.
    if (!validarSimulador()) return;

    let monto = Number(recuperaraTexto("montoCredito"));
    let plazoAnios = Number(recuperaraTexto("plazoCredito"));
    let ingresos = Number(clienteCredito.ingresos);
    let egresos = Number(clienteCredito.egresos);

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
// PARTE 3 - PASO 2: registrar una única vez la solicitud aprobada.
function solicitarCredito() {
    if (!creditoAprobado || clienteCredito === null) {
        return;
    }
    let credito = {
        cedula: clienteCredito.cedula,
        nombre: clienteCredito.nombre,
        apellido: clienteCredito.apellido,
        monto: montoCalculado,
        tasa: tasaInteres,
        plazo: plazoCalculado,
        cuota: cuotaCalculada
    };
    creditos.push(credito);
    creditoAprobado = false;
    document.getElementById("btnSolicitarCredito").disabled = true;
    mostrarTexto("mensajeAsignacion", "Crédito asignado correctamente. Revíselo en Créditos Registrados.");
}

// PASO 4: devolver todos los créditos de la cédula recibida.
function buscarCreditos(cedula) {
    let encontrados = [];
    for (let i = 0; i < creditos.length; i++) {
        if (creditos[i].cedula === cedula) {
            encontrados.push(creditos[i]);
        }
    }
    return encontrados;
}

// PASOS 5 Y 7: esta misma función pinta un filtro o todo el arreglo.
function pintarCreditos(creditos) {
    let contenido = "";
    for (let i = 0; i < creditos.length; i++) {
        let credito = creditos[i];
        contenido += `<tr>
            <td>${escaparHTML(credito.cedula)}</td>
            <td>${escaparHTML(credito.nombre)}</td>
            <td>${escaparHTML(credito.apellido)}</td>
            <td>$${credito.monto.toFixed(2)}</td>
            <td>${credito.tasa}%</td>
            <td>${credito.plazo} año(s) (${credito.plazo * 12} meses)</td>
            <td>$${credito.cuota.toFixed(2)}</td>
        </tr>`;
    }
    if (creditos.length === 0) {
        contenido = '<tr><td colspan="7">No hay créditos registrados para esta consulta.</td></tr>';
    }
    mostrarHTML("tablaCreditos", contenido);
    mostrarTexto("mensajeHistorial", "Créditos encontrados: " + creditos.length);
}

// PASO 6: leer la cédula, buscar y pintar el resultado.
function buscarCreditosCliente() {
    let cedula = recuperaraTexto("buscarCedulaListado").trim();
    if (cedula === "") {
        pintarCreditos([]);
        mostrarTexto("mensajeHistorial", "Ingrese una cédula para buscar o presione Ver todos.");
        return;
    }
    let resultado = buscarCreditos(cedula);
    pintarCreditos(resultado);
}

// Cualquier cambio en la solicitud exige calcular otra vez antes de asignar.
function invalidarCredito() {
    creditoAprobado = false;
    document.getElementById("btnSolicitarCredito").disabled = true;
    document.getElementById("resultadoCredito").className = "";
    mostrarTexto("resultadoCredito", "");
    mostrarTexto("mensajeAsignacion", "");
}

for (let id of ["montoCredito", "plazoCredito"]) {
    document.getElementById(id).addEventListener("input", invalidarCredito);
}
document.getElementById("buscarCedulaCredito").addEventListener("input", function () {
    clienteCredito = null;
    invalidarCredito();
    mostrarTexto("datosClienteCredito", "Busque el cliente para continuar.");
});
pintarCreditos(creditos);

// Reglas del ejercicio, ajustables según el producto de crédito.
const REGLAS_SIMULADOR = { montoMin: 0.01, montoMax: 100000, plazoMin: 1,
    plazoMax: 30, dineroMax: 1000000, tasaMin: 10, tasaMax: 20 };

function errorSimulador(campo, mensaje) {
    const salida = document.getElementById("error_" + campo);
    if (salida) salida.innerText = mensaje;
    const entrada = document.getElementById(campo);
    if (entrada && entrada.tagName === "INPUT") {
        entrada.setAttribute("aria-invalid", mensaje ? "true" : "false");
        entrada.setAttribute("aria-describedby", "error_" + campo);
    }
}

function validarSimulador() {
    const errores = {};
    const campos = ["buscarCedulaCredito", "montoCredito", "plazoCredito", "tasaCredito",
        "cliente_cedula", "cliente_nombre", "cliente_apellido", "cliente_ingresos", "cliente_egresos"];
    campos.forEach(campo => errorSimulador(campo, ""));
    mostrarTexto("resultadoCredito", "");

    const cedula = recuperaraTexto("buscarCedulaCredito").trim();
    if (!cedula) errores.buscarCedulaCredito = "Ingrese la cédula del cliente.";
    else if (!/^\d{10}$/.test(cedula))
        errores.buscarCedulaCredito = "La cédula debe contener exactamente 10 dígitos.";
    else if (!clienteCredito || clienteCredito.cedula !== cedula)
        errores.buscarCedulaCredito = "Busque un cliente registrado con esta cédula antes de calcular.";

    // Lee el texto completo: evita aceptar parcialmente valores como 12abc.
    function validarNumero(id, min, max, entero) {
        const entrada = document.getElementById(id);
        const texto = entrada.value.trim();
        const numero = Number(texto);
        if (entrada.validity.badInput) errores[id] = "Ingrese un número válido.";
        else if (!texto) errores[id] = "Este campo es obligatorio.";
        else if (!Number.isFinite(numero)) errores[id] = "Ingrese un número válido y finito.";
        else if (numero < min || numero > max)
            errores[id] = "Ingrese un valor entre " + min + " y " + max + ".";
        else if (entero && !Number.isInteger(numero)) errores[id] = "El plazo debe ser un número entero de años.";
        else if (!entero && Math.abs(numero * 100 - Math.round(numero * 100)) > 0.000001)
            errores[id] = "Use como máximo dos decimales.";
        return numero;
    }
    validarNumero("montoCredito", REGLAS_SIMULADOR.montoMin, REGLAS_SIMULADOR.montoMax, false);
    validarNumero("plazoCredito", REGLAS_SIMULADOR.plazoMin, REGLAS_SIMULADOR.plazoMax, true);
    const tasaTexto = recuperaraTexto("tasaInteres").trim();
    const tasa = Number(tasaTexto);
    if (!tasaTexto || !Number.isFinite(tasa) || tasa < 10 || tasa > 20 ||
        document.getElementById("tasaInteres").validity.badInput)
        errores.tasaCredito = "En Parámetros, ingrese y guarde una tasa entre 10 % y 20 %.";
    else if (tasa !== tasaInteres)
        errores.tasaCredito = "Guarde la tasa modificada en Parámetros antes de calcular.";

    if (clienteCredito && clienteCredito.cedula === cedula) {
        const cliente = clienteCredito;
        if (!/^\d{10}$/.test(cliente.cedula)) errores.cliente_cedula = "Corrija la cédula: debe tener 10 dígitos.";
        for (const campo of ["nombre", "apellido"]) {
            const texto = String(cliente[campo] ?? "").trim();
            if (texto.length < 2 || texto.length > 80 || !/^[\p{L}\p{M}]+(?:[ '’-][\p{L}\p{M}]+)*$/u.test(texto))
                errores["cliente_" + campo] = "Corrija " + campo + ": de 2 a 80 caracteres; use letras, espacios, apóstrofos o guiones.";
        }
        for (const campo of ["ingresos", "egresos"]) {
            const valor = cliente[campo];
            const numero = Number(valor);
            if (valor === null || valor === undefined || String(valor).trim() === "" || !Number.isFinite(numero) ||
                numero < (campo === "ingresos" ? 0.01 : 0) || numero > REGLAS_SIMULADOR.dineroMax ||
                Math.abs(numero * 100 - Math.round(numero * 100)) > 0.000001)
                errores["cliente_" + campo] = "Corrija " + campo + ": entre " + (campo === "ingresos" ? "0,01" : "0") + " y 1.000.000, con máximo dos decimales.";
        }
        // Egresos superiores a ingresos son posibles: la capacidad de pago será cero.
    }
    for (const campo of Object.keys(errores)) errorSimulador(campo, errores[campo]);
    if (Object.keys(errores).length) {
        mostrarTexto("resultadoCredito", "Revise los campos indicados. Los datos del cliente se corrigen en Clientes y luego se vuelve a buscar al cliente.");
        const primero = document.querySelector('#creditos input[aria-invalid="true"]');
        if (primero) primero.focus();
        return false;
    }
    return true;
}
// Cambiar la tasa invalida la aprobación previa, sin ejecutar validaciones.
document.getElementById("tasaInteres").addEventListener("input", invalidarCredito);
