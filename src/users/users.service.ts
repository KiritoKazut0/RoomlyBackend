import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponse } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    try {
      const isUserExist = await this.findByEmail(createUserDto.email);
      if (isUserExist) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const newUser = await this.userRepository.save(createUserDto);
      return plainToInstance(UserResponse, newUser, {
        excludeExtraneousValues: true,
      });

    } catch (error) {
      console.error(error)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error creating user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<UserResponse[] | null> {
    try {
      const users = await this.userRepository.find();
      if (!users) {
        return null
      }

      return users.map(user =>
        plainToInstance(UserResponse, user, {
          excludeExtraneousValues: true,
        })
      );
    } catch (error) {
      console.log(error)
      throw new HttpException('Error retrieving users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<UserResponse | null> {
    try {
      if (!id) {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return plainToInstance(UserResponse, user, {
        excludeExtraneousValues: true,
      });

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error retrieving user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse | null> {
    try {

      const userExist = await this.userRepository.findOneBy({ id })

      if (!userExist) {
        throw new HttpException(
          `Task with ID ${id} not found`,
          HttpStatus.NOT_FOUND
        );
      }

     const updateResult = await this.userRepository.update(id, updateUserDto);

     if(updateResult.affected === 0){
      throw new HttpException(
          'Task could not be updated',
          HttpStatus.BAD_REQUEST
        );
     }

     const user = await this.userRepository.findOneBy({id})
      return plainToInstance(UserResponse, user, {
        excludeExtraneousValues: true,
      });

    } catch (error) {
        if (error instanceof HttpException) {
        throw error;
      }
        
      throw new HttpException(
        'Error updating task. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {

      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.userRepository.delete(id);
      return { message: 'User deleted successfully' };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error deleting user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

 async findByEmail(email: string): Promise<User | null> {
    try {
      if (!email) {
        return null;
      }

      const user = await this.userRepository.findOneBy({ email });
      return user;

    } catch (error) {
      throw new HttpException('Error finding user by email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
