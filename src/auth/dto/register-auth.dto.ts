import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsPhoneNumber,
  IsIn,
  MaxLength
} from 'class-validator';

export class RegisterAuthDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  lastName: string;

  @IsNotEmpty()
  @IsPhoneNumber('MX')
  phone: string;

  @IsNotEmpty()
  @IsIn(['Estudiante', 'Propietario'])
  rol: 'Estudiante' | 'Propietario';

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}
