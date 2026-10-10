
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
    let nuevoCliente = {
        cedula: recuperaraTexto("Cedula").trim(),
        nombre: recuperaraTexto("Nombre").trim(),
        apellido: recuperaraTexto("Apellido").trim(),
        ingresos: recuperarFloat("Ingresos"),
        egresos: recuperarFloat("Egresos")
    };

    clientes.push(nuevoCliente);
    pintarClientes();
    mostrarTexto("mensajeCliente", "Cliente guardado correctamente.");
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
}