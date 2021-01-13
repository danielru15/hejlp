const config = {
    apiKey: "AIzaSyCYdkydJK0buhD4aA5ug3ag91M-zV1zr1Q",
    authDomain: "foodqrs-15e13.firebaseapp.com",
    databaseURL: "https://foodqrs-15e13.firebaseio.com",
    projectId: "foodqrs-15e13",
    storageBucket: "foodqrs-15e13.appspot.com",
    messagingSenderId: "471874137789",
    appId: "1:471874137789:web:425fe0988fc81135d6d1d4",
    measurementId: "G-K0R05KC0RV"
};   
  // Initialize Firebase
  firebase.initializeApp(config);
  var db=firebase.firestore()
  const ref = firebase.storage().ref();

  /*
  ------------------------  CRUD -------------------------  
*/

// añadir plato
var Registrar = document.getElementById('enviar')
Registrar.addEventListener('submit', CrearMenu)
function CrearMenu (e) {
        e.preventDefault()
        //capturamos los input
        const Nombre = document.getElementById('nombre').value
        const Precio = document.getElementById('precio').value
        const Descripcion = document.getElementById('descripcion').value
        const file = document.getElementById("file").files[0];
        
        // validamos que los campos no esten vacios
        // subimos la data con imagen
   if( Nombre !== '' && Precio !== '' && Descripcion !== '' && file !== undefined){
        const name = file.name;
        const metadata = { contentType: file.type };
        const task = ref.child(name).put(file, metadata);
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
        db.collection("Menu").add({
            Nombre:Nombre,
            image:url,
            Precio:Precio,
            Descripcion:Descripcion,
        })})
        .then(function(docRef) {
            // alerta
            Swal.fire({
                title: 'Plato añadido con exito',
                icon: "success",
              })
             // formatea el form 
            Registrar.reset()
            // cerrar el modal
            $('#exampleModal').modal('hide')
        })
        .catch(function(error) {
           //alerta
           
        });
        //  Pero si no hay imagen para subir, subimos la data sin imagen
    } else if (Nombre !== '' && Precio !== '' && Descripcion !== '' && file === undefined){
        db.collection("Menu").add({
            Nombre:Nombre,
            Precio:Precio,
            Descripcion:Descripcion,
        })
        .then(function(docRef) {
            // alerta
            Swal.fire({
                title: 'Plato añadido con exito',
                icon: "success",
              })
             // formatea el form 
            Registrar.reset()
            // cerrar el modal
            $('#exampleModal').modal('hide')
        })
    } else {
          Swal.fire({
            title: 'No se pude añadir un plato vacio, porfavor llena nombre, descripcion y precio',
            icon: "error",
          })
        }
}
/* ------- mostrar en pantalla ------*/
const Datos = document.getElementById('contenedor')
// traer datos
db.collection("Menu").onSnapshot((querySnapshot) => {
    // me pinta cada fila de a 1
    Datos.innerHTML=''
    querySnapshot.forEach((doc) => {
        Datos.innerHTML+= `
        <div id="foodcard">                      
          <div class="info">
             <h3>${doc.data().Nombre}</h3>
             <img src="${doc.data().image}" alt="">
             <p class="descripcion">${doc.data().Descripcion}</p>
             <p class="precio">$${doc.data().Precio}</p>
          </div>
          <div class="buttons">
             <button id="Editando" class="btn btn-info" data-toggle="modal" data-target="#exampleModal" onclick="Editar('${doc.id}','${doc.data().Nombre}','${doc.data().Descripcion}','${doc.data().Precio}')">Editar</button>
             <button id="Eliminar" class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button>
          </div>
         </div>
    `
   });
});

/*
EDITAR
*/
function Editar(id,Nombre,Descripcion,Precio) {
    document.getElementById('nombre').value = Nombre
    document.getElementById('precio').value = Precio
    document.getElementById('descripcion').value = Descripcion
    const file = document.getElementById("file").files[0];
    var boton = document.getElementById('actualizar');
    boton.innerHTML = 'Actualizar';
    // si se hace click en el nuevo boton con el nombre actualizar
    // validamos si el input del archivo no este definido 
    if (file === undefined){
        boton.onclick =  function (e) {
            e.preventDefault()
            var actualizar = db.collection('Menu').doc(id);
            const Nombre = document.getElementById('nombre').value
            const Precio = document.getElementById('precio').value
            const Descripcion = document.getElementById('descripcion').value
            return actualizar.update({
                Nombre:Nombre,
                Precio:Precio,
                Descripcion:Descripcion,
            }).then(function () {
                // cerrar el modal
                $('#exampleModal').modal('hide')
                // cambiar el boton x el de guardar
                boton.innerHTML = 'Guardar';
                boton.onclick=function(){
                    CrearMenu();
                } 
                 // formatea el form 
                Registrar.reset()
                // alerta
                Swal.fire({
                 title: 'Plato actualizado correctamente',
                 icon: "success",
                }) 
            }).catch(function (error) {
                //alerta
                Swal.fire({
                 title: 'No se pudo actualizar plato',
                 icon: "error",
                })
            })
        } // pero si esta definido ejecutamos este codigo
    }else if (file !== undefined){
        boton.onclick = function (e) {
            e.preventDefault()
            var actualizar = db.collection('Menu').doc(id);
            const Nombre = document.getElementById('nombre').value
            const Precio = document.getElementById('precio').value
            const Descripcion = document.getElementById('descripcion').value
            const name = file.name;
            const metadata = { contentType: file.type };
            const task = ref.child(name).put(file, metadata);
            task
            .then(snapshot => snapshot.ref.getDownloadURL())
             .then(url => {
                 console.log(url)
            return actualizar.update({
                Nombre:Nombre,
                image:url,
                Precio:Precio,
                Descripcion:Descripcion,
            })}).then(function () {
                // cerrar el modal
                $('#exampleModal').modal('hide')
                // cambiar el boton x guardar
                boton.innerHTML = 'Guardar';
                boton.onclick=function(){
                    CrearMenu();
                } 
                 // formatea el form 
                Registrar.reset()
                // alerta
                Swal.fire({
                 title: 'Plato actualizado correctamente',
                 icon: "success",
                }) 
            }).catch(function (error) {
                //alerta
                Swal.fire({
                 title: 'No se pudo actualizar plato',
                 icon: "error",
                })
            })
        } 
    }
}
/*
Eliminar
*/
function eliminar(id) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary'
        },
        buttonsStyling: true
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Esta seguro que desea eliminar este plato?',
        text: "Esta operacion no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            db.collection("Menu").doc(id).delete().then(function () {
                // alerta
                swalWithBootstrapButtons.fire({
                 title: 'Plato eliminado correctamente',
                 icon: "success",
                }) 
             }).catch(function (error) {
                 console.error("Error removing document: ", error);
             });   
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: 'Operacion cancelada',
                icon: "error",
               }) 
        }
      })
}