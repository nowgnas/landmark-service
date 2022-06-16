import { Landmark } from 'src/landmarks/landmarks.entity';
import { Users } from 'src/users/users.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Visited {
    @PrimaryGeneratedColumn()
    index: number;

    @Column({ type: 'varchar', length: 2083 })
    landmark_img: string;

    @Column()
    landmark_id: number;

    @Column()
    user_id: string;

    @ManyToOne(() => Landmark, (landmark) => landmark.visited, {
        eager: true,
        cascade: true,
    })
    @JoinColumn({ name: 'landmark_id' })
    landmark: Landmark;

    @ManyToOne(() => Users, (user) => user.visited, {
        eager: true,
        cascade: true,
    })
    @JoinColumn({ name: 'user_id' })
    user: Users;
}
