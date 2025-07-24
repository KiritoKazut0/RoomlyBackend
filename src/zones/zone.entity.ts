import { Room } from "src/rooms/entities/room.entity";
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    OneToMany 
} from "typeorm";

@Entity('zones')

export class Zone {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", nullable: false })
    name: string;

    @OneToMany(() => Room, (room) => room.zone)
    rooms: Room[];
}