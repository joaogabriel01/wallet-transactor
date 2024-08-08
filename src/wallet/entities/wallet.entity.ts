import { Column, PrimaryGeneratedColumn } from 'typeorm';

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
