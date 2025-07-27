import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() authDto: RegisterAuthDto) {
    return this.authService.register(authDto);
  }

  @Post('/login')
  access(@Body() authDto: LoginAuthDto){
    return this.authService.access(authDto)
  }
  
}
