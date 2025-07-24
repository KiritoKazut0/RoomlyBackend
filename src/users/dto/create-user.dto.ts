import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsPhoneNumber,
  IsIn
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
    
      @IsNotEmpty()
      @IsString()
      @MinLength(4)
      password: string;
}
