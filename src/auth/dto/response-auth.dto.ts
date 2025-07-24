import { Exclude, Expose } from "class-transformer";

export class ResponseAuthDto {
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

    @Exclude()
    password:string

    @Expose()
    token: string

    constructor(partial: Partial<ResponseAuthDto>){
        Object.assign(this, partial)
    }

}