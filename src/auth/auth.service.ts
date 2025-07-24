import { Injectable } from '@nestjs/common';
import { LoginAuthDto} from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {

   access(acessAuthDto: LoginAuthDto) {
    return `This action updates a # auth`;
  }


  register(registerAuthDto: RegisterAuthDto) {
    return 'This action adds a new auth';
  }


 private findByEmail(email: string) {
    return `This action returns a #${email} auth`;
  }

 

}
