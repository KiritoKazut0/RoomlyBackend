import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsPhoneNumber,
  IsIn,
  ValidateIf,
  IsUrl
} from 'class-validator';

export class CreateUserDto {
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

  @ValidateIf(o => o.image !== undefined && o.image !== '')
  @IsUrl({}, { message: 'image must be a valid url' })
  image?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}
