import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { LocationModule } from 'src/location/location.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    LocationModule,
    UsersModule
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule { }
