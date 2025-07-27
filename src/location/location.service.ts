import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Zone } from './entities/zone.entity';
import { Repository } from 'typeorm';
import { State } from './entities/state.entity';
import { City } from './entities/city.entity';

@Injectable()

export class LocationService {
    constructor(
        @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
        @InjectRepository(State) private stateRepository: Repository<State>,
        @InjectRepository(City) private cityRepository: Repository<City>
    ) { }

    async findOrCreateState(name: string): Promise<State> {

        try {
            let state = await this.stateRepository.findOne({ where: { name } })
            if (!state) {
                state = this.stateRepository.create({ name })
                state = await this.stateRepository.save(state)
            }

            return state
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                'Failed to create state for location',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

    }


    async findOrCreateCity(name: string, id_state: string): Promise<City> {
        try {
            let city = await this.cityRepository.findOne({
                where: {
                    name,
                    state: {
                        id: id_state
                    }
                }
            })
            if (!city) {

                city = this.cityRepository.create({
                    name,
                    state: { id: id_state }
                })

                city = await this.cityRepository.save(city)
            }

            return city
        } catch (error) {

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                'There was a problem. Failed to create city or shearch city',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

    }


    async findOrCreateZone(name: string, id_city: string): Promise<Zone> {
        try {
            let zone = await this.zoneRepository.findOne({
                where: {
                    name,
                    city: {
                        id: id_city
                    }
                }
            })

            if (!zone) {
                zone = this.zoneRepository.create({
                    name,
                    city: { id: id_city }
                })
                zone = await this.zoneRepository.save(zone)
            }

            return zone
        } catch (error) {

            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'There was a problem. Failed to create zone or shearch zone',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

}
