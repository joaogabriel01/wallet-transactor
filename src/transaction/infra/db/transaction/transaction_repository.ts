import { Repository } from 'typeorm';
import { Transaction } from 'src/transaction/core/domain/transaction';
import { TransactionEntity } from './entities/entity';
import { OrmTransferCore } from './entities/orm_transfer_core';

export class TransactionRepository {
    private ormRepository: Repository<TransactionEntity>;

    constructor(ormRepository: Repository<TransactionEntity>) {
        this.ormRepository = ormRepository;
    }

    async save(transaction: Transaction): Promise<Transaction> {
        const entityOrm = OrmTransferCore.domainToOrm(transaction);
        const transactionEntity = this.ormRepository.create(entityOrm);
        const savedTransaction =
            await this.ormRepository.save(transactionEntity);

        return OrmTransferCore.ormToDomain(savedTransaction);
    }

    async findById(id: string): Promise<Transaction | null> {
        const transactionEntity = await this.ormRepository.findOneBy({ id });
        if (!transactionEntity) return null;

        return OrmTransferCore.ormToDomain(transactionEntity);
    }
}
