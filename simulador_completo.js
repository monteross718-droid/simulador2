
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
    let valor = document.getElementById("tasaInteres");
    let tasa = Number(valor);
    
    if(tasa >10 && tasa <= 20){
      tasaInteres = tasa;
     document.getElementById("mensajeTasa").innerText =
        "Tasa configurada correctamente: " + tasaInteres + "%";
    } else {
        document.getElementById("mensajeTasa").innerText =
        "La tasa debe estar entre 10% y 20%";
    }
 }