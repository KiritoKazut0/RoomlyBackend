import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { In, Not, Repository } from 'typeorm';
import { LocationService } from 'src/location/location.service';
import { UsersService } from 'src/users/users.service';
import { ResponseRoomsDto } from './dto/response-room.dto';


@Injectable()
export class RoomsService {
  constructor(
    private readonly locationService: LocationService,
    private readonly userService: UsersService,
    @InjectRepository(Room) private roomRepository: Repository<Room>

  ) { }

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const { zone: zoneName, state: stateName, city: cityName, id_user } = createRoomDto;

      const user = await this.userService.findOne(id_user)
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }

      if (user.rol === 'Estudiante') {
        throw new HttpException(
          'Only Propietarios can perform this action',
          HttpStatus.FORBIDDEN
        )
      }
      const state = await this.locationService.findOrCreateState(stateName)
      const city = await this.locationService.findOrCreateCity(
        cityName,
        state.id
      )

      const zone = await this.locationService.findOrCreateZone(
        zoneName,
        city.id
      )

      const room = this.roomRepository.create({
        owner: { id: user.id },
        description: createRoomDto.description,
        images: createRoomDto.images,
        location_number: createRoomDto.location_number,
        location_postal_code: createRoomDto.location_postal_code,
        location_street: createRoomDto.location_street,
        zone: { id: zone.id },
        other_services: createRoomDto.other_services,
        price_monthly: createRoomDto.price_monthly,
        services: createRoomDto.services
      })

      return await this.roomRepository.save(room)

    } catch (error) {

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        "Failed to create room with location data",
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findAll(): Promise<ResponseRoomsDto[]> {
    try {
      const rooms = await this.roomRepository.find({
        where: {
          status: Not(In(['En revision', 'Ocupado']))
        },
        relations: ['owner', 'zone', 'zone.city', 'zone.city.state']
      })

      const response: ResponseRoomsDto[] = rooms.map((room) => {
        return {
          id: room.id,
          estado: room.zone.city.state.name,
          descripcion: room.description,
          photo_album: room.images,
          cp: room.location_postal_code,
          status: room.status,
          precio_mensual: room.price_monthly,
          servicios: room.services,
          otros_servicios: room.other_services,
          calle: room.location_street,
          numero_casa: room.location_number,
          colonia: room.zone.name,
          ciudad: room.zone.city.name
        }
      });

      return response

    } catch (error) {
      throw new HttpException(
        'Failed to list Rooms',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findByUser(id_user: string): Promise<ResponseRoomsDto[]> {
    try {

      const user = await this.userService.findOne(id_user);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }

      const rooms = await this.roomRepository.find({
        where: {
          owner: { id: user.id }
        },
          relations: ['owner', 'zone', 'zone.city', 'zone.city.state']
      })

      const response: ResponseRoomsDto[] = rooms.map((room) => {
        return {
          id: room.id,
          estado: room.zone.city.state.name,
          descripcion: room.description,
          photo_album: room.images,
          cp: room.location_postal_code,
          status: room.status,
          precio_mensual: room.price_monthly,
          servicios: room.services,
          otros_servicios: room.other_services,
          calle: room.location_street,
          numero_casa: room.location_number,
          colonia: room.zone.name,
          ciudad: room.zone.city.name
        }
      })
     
      return response

    } catch (error) {

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to shearch user',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

async findPopular(): Promise<ResponseRoomsDto[]> {
  try {
    const rooms = await this.roomRepository.find({
      relations: ['owner', 'zone', 'zone.city', 'zone.city.state']
    });

    const premiumRooms = rooms.filter(room => room.owner.tipo_suscription === 'Premium');

    const response: ResponseRoomsDto[] = premiumRooms.map((room) => {
      return {
        id: room.id,
        estado: room.zone.city.state.name,
        descripcion: room.description,
        photo_album: room.images,
        cp: room.location_postal_code,
        status: room.status,
        precio_mensual: room.price_monthly,
        servicios: room.services,
        otros_servicios: room.other_services,
        calle: room.location_street,
        numero_casa: room.location_number,
        colonia: room.zone.name,
        ciudad: room.zone.city.name
      };
    });

    return response;
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to search rooms',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}



  async findOne(id: string): Promise<ResponseRoomsDto> {
    try {

      const room = await this.roomRepository.findOne({
        where: { id },
        relations: ['owner', 'zone', 'zone.city', 'zone.city.state']
      })

      if (!room) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND)
      }

      return {
         id: room.id,
          estado: room.zone.city.state.name,
          descripcion: room.description,
          photo_album: room.images,
          cp: room.location_postal_code,
          status: room.status,
          precio_mensual: room.price_monthly,
          servicios: room.services,
          otros_servicios: room.other_services,
          calle: room.location_street,
          numero_casa: room.location_number,
          colonia: room.zone.name,
          ciudad: room.zone.city.name
      }

    } catch (error) {

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to shearch room',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<ResponseRoomsDto> {
    try {
      const room = await this.roomRepository.findOne({
        where: { id },
        relations: ['zone', 'zone.city', 'zone.city.state']
      });

      if (!room) {
        throw new NotFoundException(`Room with id ${id} not found`);
      }

      const { state: stateName, city: cityName, zone: zoneName, ...safeFields } = updateRoomDto;
      const isChangingLocation = stateName || cityName || zoneName;

      if (isChangingLocation) {
        if (!stateName || !cityName || !zoneName) {
          throw new BadRequestException('If updating location, stateName, cityName, and zoneName must all be provided.');
        }

        const state = await this.locationService.findOrCreateState(stateName);
        const city = await this.locationService.findOrCreateCity(cityName, state.id);
        const zone = await this.locationService.findOrCreateZone(zoneName, city.id);
        room.zone = { id: zone.id } as any;
      }

      Object.assign(room, safeFields);

       await this.roomRepository.save(room);

       const roomUpdate = await this.findOne(room.id)
       return roomUpdate
      
    } catch (error) {
      console.log(error)

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed tu update details room',
        HttpStatus.INTERNAL_SERVER_ERROR
      )

    }

  }


  async remove(id: string): Promise<{ message: string }> {
    try {
      const room = await this.roomRepository.findOneBy({ id })
      if (!room) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }

      await this.roomRepository.delete(id)
      return { message: 'Room deleted successfully' };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error deleting user', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

}
