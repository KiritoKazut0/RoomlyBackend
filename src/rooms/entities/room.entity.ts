import { Zone } from "src/location/entities/zone.entity";
import { User } from "src/users/entities/user.entity";
import { Review } from "src/reviews/entities/review.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn
} from "typeorm";

 enum RoomService {
    BATHROOM = 'Baño',
    WIFI = 'Wifi',
    FURNISHED = 'Amueblado',
    KITCHEN = 'Cocina',
    AIR_CONDITIONING = 'Clima'
}

@Entity('rooms')
export class Room {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.rooms)
    @JoinColumn({ name: 'id_user' })
    owner: User;


    @ManyToOne(() => Zone, (zone) => zone.rooms)
    @JoinColumn({ name: 'id_zone' })
    zone: Zone;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @Column({
        type: 'enum',
        enum: ['Ocupado', 'Disponible', 'En revision'],
        default: 'En revision'
    })
    status: 'Ocupado' | 'Disponible' | 'En revision';

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: false
    })
    price_monthly: number;

    @Column({
        type: "text",
        array: true,
        nullable: false,
        default: []
    })
    images: string[]

    @Column({ type: 'numeric', nullable: true })
    calificacion_promedio: number;

    @Column({
        type: 'enum',
        enum: RoomService,
        array: true,
        default: []
    })
    services: RoomService[];

    @Column({
        type: 'text',
        array: true,
        nullable: true,
        default: []
    })
    other_services: string[];

    @OneToMany(() => Review, (review) => review.room)
    reviews: Review[];

    @Column({ type: 'varchar', nullable: false })
    location_street: string;

    @Column({ type: 'integer', nullable: false })
    location_number: number;

    @Column({ type: 'varchar', nullable: false })
    location_postal_code: string;
}