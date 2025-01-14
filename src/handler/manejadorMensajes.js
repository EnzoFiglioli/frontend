export const handlerMessage = (data) => {
    return new Promise((res,rej)=>{
        if(!data){
            rej("Error al traer datos de mensajes");
        }
        res(data);
    })
}