import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column()
    username: string;

   @Column()
   password: string;
}
