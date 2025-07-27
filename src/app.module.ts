import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { ImagesModule } from './images/images.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewsModule } from './reviews/reviews.module';
import {ConfigModule} from "@nestjs/config"
import {TypeOrmModule} from "@nestjs/typeorm"
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    TypeOrmModule.forRoot({
      type: 'postgres' ,
      host: process.env.HOST_DATABASE,
      username: process.env.USERNAME_DATABASE,
      password: process.env.PASSWORD_DATABASE,
      database: process.env.NAME_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      port: parseInt(process.env.PORT_DATABASE ||'5432'), 
      // logging: "all"
    }),
    AuthModule,
    UsersModule,
    RoomsModule,
    ImagesModule,
    PaymentModule,
    ReviewsModule,
    LocationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
