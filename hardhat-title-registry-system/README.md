# Primera versión del sistema de registro de titulos de propiedad
1. Crear un sistema de registro de titulos de propiedad  descentralizado  
        1. `listTitle`: Listar los titulos de propiedad en el sistema de registro  
        2. `buyTitle`: Comprar un titulo de propiedad  
        3. `cancelTitle`: Cancela el listado de un titulo de propiedad  
        4. `updateListing`: Actualiza la información de un titulo de propiedad  
        5. `withdrawProceeds`: Retirar el pago cuando una venta se complete exitosamente  

# Segunda versión del sistema de registro de titulos de propiedad  
1. Crear un sistema de registro de titulos de propiedad  descentralizado  
        1. `addSuperAdmin`: Crea el usuario super admin. Esta función puede ser llamada por el dueño del contrato(persona que desplego el contrato). La dirección (ethereum) del super admin y de la sociedad a la cual sera asignado se provee por parametro. Cada dirección de super admin es asociada a su ciudad o area correspondiente.  
        2. `registration`:Registra el titulo de una propiedad. Detalla las caracteristicas de la propiedad en cuestión como provincia, distrito, ciudad, número de registro de la operación, la dirección (ethereum) del dueño, valor de la propiedad y el codigo identificador de la propiedad son provistas por parametros. Esta función solo puede ser llamada por los super admins y el registro es aprobado por parte del super admin asignado a la locación donde se encuentra la propiedad.   
        3. `landInfoOwer`:  Función para que el dueño vea los detalles de su propiedad. Los parametros de la función son identificador de la propiedad (ID), provincia, distrito, ciudad, número de registro de titulo, disponibilidad para compra, dirección de la persona quien solicito la propiedad para su compra y el resultado será el estado de la solicitud (aceptado, rechazado, pendiente).  
        4. `landInfoUser`:  
        5. `computeId`:  
        6. `requestToLandOwner`:  
        7. `viewAssets`:  
        8. `viewRequest`:  
        9. `processRequest`:  
        10. `makeAvailable`:  
        11. `buyProperty`:  
        12. `removeOwnership`:  
        13. `findId`: 
