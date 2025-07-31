import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsPhoneNumber,
  IsIn,
  Matches
} from 'class-validator';

export class RegisterAuthDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
  message: 'Name must not contain numbers or special characters',
})
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
  message: 'Name must not contain numbers or special characters',
})
  lastName: string;

  @IsNotEmpty()
  @IsPhoneNumber('MX')
  @Matches(/^\d+$/, { message: 'Phone must not contain letters or symbols' })
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
