import { Transaction } from 'src/transaction/core/domain/transaction';
import { TransactionEntity } from './entity';
import { EssentialData } from 'src/transaction/core/domain/essential_account_data';
import { Either, left, right } from 'src/utils/either';

export class OrmTransferCore {
    public static ormToDomain(
        entity: TransactionEntity,
        amountOrigin?: number,
        amountSender?: number,
    ): Transaction {
        const { amount, accountOrigin, accountSender } = entity;

        amountOrigin = amountOrigin ?? 0;
        amountSender = amountSender ?? 0;

        const essentialOrigin = new EssentialData(accountOrigin, amountOrigin);
        const essentialTarget = new EssentialData(accountSender, amountSender);
        const transaction = new Transaction(
            essentialOrigin,
            essentialTarget,
            amount,
        );
        return transaction;
    }

    public static domainToOrm(domain: Transaction): TransactionEntity {
        const orm = new TransactionEntity();

        const attDomain = this.getDomainAttr(domain);
        if (attDomain.isLeft) {
            return orm;
        }
        const { idOrigin, idSender, amount } = attDomain.value;
        orm.accountOrigin = idOrigin;
        orm.accountSender = idSender;
        orm.amount = amount;

        return orm;
    }

    private static getDomainAttr(domain: Transaction): Either<string, any> {
        const err = left('error in domain');
        const obj: any = {};
        const idOrigin = domain.getOriginId();
        if (idOrigin.isLeft()) {
            return err;
        }
        const idSender = domain.getTargetId();
        if (idSender.isLeft()) {
            return err;
        }

        const amount = domain.getAmount();
        if (amount.isLeft()) {
            return err;
        }
        obj.idOrigin = idOrigin;
        obj.idSender = idSender;
        obj.amount = amount;
        return right(obj);
    }
}
