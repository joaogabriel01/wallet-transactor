import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    // eslint-disable-next-line indent
    id: string;

    @Column()
    // eslint-disable-next-line indent
    amount: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    // eslint-disable-next-line indent
    date: Date;

    @Column()
    // eslint-disable-next-line indent
    accountOrigin: string;

    @Column()
    // eslint-disable-next-line indent
    accountSender: string;

    @Column({ default: true })
    // eslint-disable-next-line indent
    hasBeenReversed: boolean;
}
