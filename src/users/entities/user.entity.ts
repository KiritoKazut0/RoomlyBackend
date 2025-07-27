import { Room } from "src/rooms/entities/room.entity";
import { Review } from "src/reviews/entities/review.entity";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn
} from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    lastName: string;

    @Column({ type: 'varchar', nullable: true })
    image: string

    @Column({ type: 'varchar', nullable: false })
    phone: string;

    @Column({
        type: 'enum',
        enum: ["Estudiante", "Propietario"]
    })
    rol: 'Estudiante' | 'Propietario';

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    // datos del metodo de pago 
    @Column({
        type: 'enum',
        enum: ["Basico", "Premium"],
        default: "Basico"
    })
    tipo_suscription: "Basico" | "Premium"

    @Column({
        type: 'varchar',
        nullable: true
    })
    id_suscription: string

    @CreateDateColumn({ type: 'timestamp' })
    date: Date;

    @OneToMany(() => Room, (room) => room.owner)
    rooms: Room[];

    @OneToMany(() => Review, (review) => review.student)
    reviews: Review[];
}