import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ballance: number;

    @Column()
    name: string;

    @Column()
    password?: string;
}
