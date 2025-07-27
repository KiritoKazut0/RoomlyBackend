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

    
        constructor(partial: Partial<UserResponse>){
            Object.assign(this, partial)
        }
    
}