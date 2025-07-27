import { Exclude, Expose } from "class-transformer"


export class UserResponse {
       @Expose()
        id: string
    
        @Expose()
        name: string
    
        @Expose()
        lastName: string
    
        @Expose()
        phone: string
    
        @Expose()
        rol: string
    
        @Expose()
        email: string

        @Expose()
        image: string
    
        @Exclude()
        password:string

        @Expose()
        tipo_suscription: "Basico" | "Premium"

        @Expose()
        id_suscription: string | null

    
        constructor(partial: Partial<UserResponse>){
            Object.assign(this, partial)
        }
    
}