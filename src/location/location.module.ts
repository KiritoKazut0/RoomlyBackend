import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './entities/zone.entity';
import { City } from './entities/city.entity';
import { State } from './entities/state.entity';


@Module({
  imports: [
  TypeOrmModule.forFeature([Zone, City, State])],
  providers: [LocationService],
  exports:[LocationService] 
})
export class LocationModule {}
