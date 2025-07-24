import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator";

export class LoginAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @MinLength(4)
    @IsString()
    password: string
}
