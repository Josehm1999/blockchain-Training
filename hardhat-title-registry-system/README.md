# Primera versión del sistema de registro de titulos de propiedad
1. Crear un sistema de registro de titulos de propiedad  descentralizado  
        1. `listTitle`: Listar los titulos de propiedad en el sistema de registro  
        2. `buyTitle`: Comprar un titulo de propiedad  
        3. `cancelTitle`: Cancela el listado de un titulo de propiedad  
        4. `updateListing`: Actualiza la información de un titulo de propiedad  
        5. `withdrawProceeds`: Retirar el pago cuando una venta se complete exitosamente  

# Segunda versión del sistema de registro de titulos de propiedad  
1. Crear un sistema de registro de titulos de propiedad  descentralizado  
        1. `addSuperAdmin`:  
        Crea el usuario super admin. Esta función puede ser llamada por el dueño del contrato(persona que desplego el contrato). La dirección (ethereum) del super admin y de la sociedad a la cual sera asignado se provee por parametro. Cada dirección de super admin es asociada a su ciudad o area correspondiente.     
        2. `registration`:  
        Registra el titulo de una propiedad. Detalla las caracteristicas de la propiedad en cuestión como provincia, distrito, ciudad, número de registro de la operación, la dirección (ethereum) del dueño, valor de la propiedad y el codigo identificador de la propiedad son provistas por parametros. Esta función solo puede ser llamada por los super admins y el registro es aprobado por parte del super admin asignado a la locación donde se encuentra la propiedad.   
        3. `landInfoOwer`:  
        Función para que el dueño vea los detalles de su propiedad. Los parametros de la función son identificador de la propiedad (ID), provincia, distrito, ciudad, número de registro de titulo, disponibilidad para compra, dirección de la persona quien solicito la propiedad para su compra y el resultado será el estado de la solicitud (aceptado, rechazado, pendiente).  
        4. `landInfoUser`:  
        Función para que cualquier usuario pueda ver los detalles de una propiedad. Los parametros son el identificador de la propiedad (ID) y el resultado es el dueño actual de la propiedad, el valor de la propiedad, disponibilidad de venta de la propiedad, si existen más tramites involucrando la propiedad (dirección ethereum del solicitante) y estado del trámite en cuestión.  
        5. `computeId`:  
        Función que genera un identificador unico (ID) para una propiedad. Provincia, distrito, ciudad y número de registro son provistos por parametro y se retorna el ID unico como resultado.   
        6. `requestToLandOwner`:  
        Función para solicitar la compra de una propiedad. El identificador (ID) de la propiedad se provee como parametro y la dirección (ethereum) de la solicitud es enviada al dueño de la propiedad.  
        7. `viewAssets`:  
        Función para ver las propiedades de una persona. Cuando la función es llamada, se retorna una lista con las propiedades del solicitante que empleo la función.    
        8. `viewRequest`:  
        Función para ver la dirección del solicitante respecto a una propiedad en particular, en caso existiera. El parametro es el identificador (ID) de la propiedad y la respuesta es la dirección (ethereum) del solicitante.    
        9. `processRequest`:  
        Utilizado para procesar la solicitud de compra de una propiedad. La función solo puede ser utilizado por el dueño de la propiedad. El identificador de la propiedad (ID) y el estado de la solicitud (acepatado o rechazado) son provistas por parametro.      
        10. `makeAvailable`:  
        Función para cambiar el estado de disponibilidad de una propiedad. Está función solo puede ser empleada por el dueño de la propiedad. El identificador de la propiedad es provista por parametro. Si la dirección provista es igual a la del registro de la propiedad, la propiedad es habilitada para su compra.      
        11. `buyProperty`:  
        Función para ejecutar tramite de compra de la propiedad cual previamente ha sido aprovado por el dueño. Está función solo puede ser llamada por el comprador cuya solicitud ha sido aprobada. El identificador (ID) de la propiedad es provisto por parametro y la transacción de ether correspondiente al valor y el impuesto por la propiedad se toma en intercambio de la titularidad de la propiedad.       
        12. `removeOwnership`:  
        Función llamada dentro de buyProperty(). Empleada para remover la titularidad del previo dueño de la propiedad. El identificador (ID) de la propiedad y la dirección (ethereum) del dueño anterior son pasadas de la fución buyProperty()      
        13. `findId`:  
        Función para encontrar el identificador de la propiedad en la lista de propiedades del dueño anterior. La función es utilizada dentro de la función removeOwnership(). El identificador (ID) de la propiedad y la dirección (ethereum) del anterior dueño es pasada de la función removeOwnership().   
