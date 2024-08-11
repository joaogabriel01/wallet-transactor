import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Wallet {
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column()
    ballance: number;

   @Column()
   document: string;
}
