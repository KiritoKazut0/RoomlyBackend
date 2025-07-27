import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto} from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { ResponseAuthDto } from './dto/response-auth.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService
  ){}

  async access(acessAuthDto: LoginAuthDto): Promise<{data: ResponseAuthDto, token: string}>  {
    const {email, password} = acessAuthDto
    const user = await this.userService.findByEmail(email)

    if(!user){
        throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
    }

       const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = this.jwtService.sign({nombre: user.name})

   const data = plainToInstance(ResponseAuthDto, user, {
      excludeExtraneousValues: true,
    });

    return { data,  token }

  }



  async register(registerAuthDto: RegisterAuthDto) {
    try {
      const userExist = await  this.userService.findByEmail(registerAuthDto.email)

      if(userExist){
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const {password, ...userData} = registerAuthDto
      const passwordToHash = await hash(password, 10)

      const userToCreate = {...userData, password: passwordToHash}
      const newUser = await this.userService.create(userToCreate)

      const token = this.jwtService.sign({name: newUser.name})

      const data = plainToInstance(ResponseAuthDto, newUser, {
        excludeExtraneousValues: true
      })

      return {data, token}

    } catch (error) {

       if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error creating user', HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }



}
