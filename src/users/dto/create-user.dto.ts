import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsPhoneNumber,
  IsIn,
  ValidateIf,
  IsUrl,
  Matches
} from 'class-validator';

export class CreateUserDto {
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

  @ValidateIf(o => o.image !== undefined && o.image !== '')
  @IsUrl({}, { message: 'image must be a valid url' })
  image?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}
