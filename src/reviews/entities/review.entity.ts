import { Room } from "src/rooms/entities/room.entity";
import { User } from "src/users/entities/user.entity";
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    CreateDateColumn,
    JoinColumn
} from "typeorm";

@Entity('reviews')

export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Room, (room) => room.reviews)
    @JoinColumn({ name: 'id_room' })
    room: Room;

    @ManyToOne(() => User, (user) => user.reviews)
    @JoinColumn({ name: 'id_user' })
    student: User;

    @Column({ type: 'varchar', nullable: false })
    comment: string;

    @Column({ type: 'numeric' })
    calif: number;

    @CreateDateColumn({ type: 'timestamp', name: 'fecha' })
    date: Date;
}