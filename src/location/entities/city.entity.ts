import { State } from "./state.entity";
import { Zone } from "./zone.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity('cities')
export class City {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @ManyToOne(() => State, (state) => state.cities)
    @JoinColumn({ name: 'id_state' })
    state: State;

    @OneToMany(() => Zone, (zone) => zone.city)
    zones: Zone[];
}
