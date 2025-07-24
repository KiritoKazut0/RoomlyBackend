import {} from "class-validator"

export class CreateRoomDto {
    id_user: string
    id_zone: string 
    description: string
    status: 'Ocupado' | 'Disponible'
    price_monthly: number
    services:[string]
    other_services: [string]
    location_street: string
    location_number: number
    location_postal_code: number

}
