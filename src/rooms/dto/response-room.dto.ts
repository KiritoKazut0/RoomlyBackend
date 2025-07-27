
export class ResponseRoomsDto {
    id: string
    estado: string
    descripcion: string
    photo_album: string[]
    cp: string
    status: string
    precio_mensual : number
    servicios?: string[]
    otros_servicios?: string[]
    calle: string
    numero_casa: number
    colonia: string
    ciudad: string
}