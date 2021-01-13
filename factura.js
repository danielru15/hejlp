window.addEventListener('scroll', Mesatop)
function Mesatop (){
    const Mesa = document.querySelector('.Mesa')
    Mesa.classList.toggle('sticky',window.scrollY > 2)
}
 // Variables
const vaciar = document.getElementById('vaciar');
  cargarEventListeners();

function cargarEventListeners() {

     // Al cargar el documento, mostrar sessionStorage
    document.addEventListener('DOMContentLoaded', leeRsessionStorage);
    // vaciar carrito
    vaciar.addEventListener('click', vaciarsessionStorage);
       
}
const crear = document.getElementById('factura')
function leeRsessionStorage (){
 let PlatosSs
 // comprobamos si hay algo en session storage
 if(sessionStorage.getItem('Platos')=== null){
    PlatosSs = []
 }else {
    PlatosSs = JSON.parse(sessionStorage.getItem('Platos'))
 }
PlatosSs.forEach(function(plato){
    const crear1 =document.createElement('div')
    crear1.classList.add('carro-final')
    crear1.innerHTML = `
    <div class="flex">
        <h3>${plato.Nombre}</h3>
        <p class="precio-total">${plato.Precio}</p>
        <p id="1">eliminar </p>
    </div>
    `
    crear.appendChild(crear1)

})
}
const eliminar = document.getElementById('1');
eliminar.addEventListener('click', eliminarPlato);
// eliminar plato
function eliminarPlato (e){
    e.preventDefault()
    console.log('a')
}
// vaciar carrito localstorage
function vaciarsessionStorage (e){
    e.preventDefault()
    sessionStorage.clear()
    crear.innerHTML =''
}