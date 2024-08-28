import { Either, left, right } from '../../../utils/either';
import { v4 as uuidv4 } from 'uuid';
import { IEssentialAccountData } from './essential_account_data';

export class Transaction {
    private readonly id: string;
    private originAccount: IEssentialAccountData;
    private targetAccount: IEssentialAccountData;
    private readonly value: number;
    private date: Date;
    constructor(
        originAccount: IEssentialAccountData,
        targetAccount: IEssentialAccountData,
        value: number,
        uuid?: string,
    ) {
        this.id = uuid || uuidv4();
        this.value = value;
        this.originAccount = originAccount;
        this.targetAccount = targetAccount;
        this.date = new Date();
    }

    public execute(): Either<Error, boolean> {
        const originAmount = this.originAccount.getAmount();
        if (this.value > originAmount) {
            return left(
                new Error('amount is greater than the balance in the account'),
            );
        }
        this.originAccount.setAmount(originAmount - this.value);

        const targetAmount = this.targetAccount.getAmount();
        this.targetAccount.setAmount(targetAmount + this.value);

        return right(true);
    }

    public getAmount(): Either<string, number> {
        return right(this.value);
    }

    public getOriginAccountAmount(): Either<string, number> {
        return right(this.originAccount.getAmount());
    }

    public getTargetAccountAmount(): Either<string, number> {
        return right(this.targetAccount.getAmount());
    }

    public getTransactionId(): Either<string, string> {
        return right(this.id);
    }

    public getOriginId(): Either<string, string> {
        return right(this.originAccount.getId());
    }

    public getTargetId(): Either<string, string> {
        return right(this.targetAccount.getId());
    }

    public getDate(): Either<string, Date> {
        return right(this.date);
    }
}
