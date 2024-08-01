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

    public execute(): Either<string, boolean> {
        const originAmount = this.originAccount.getAmount();
        if (this.value > originAmount) {
            return left<string, boolean>(
                'amount is greater than the balance in the account',
            );
        }
        this.originAccount.setAmount(originAmount - this.value);

        const targetAmount = this.targetAccount.getAmount();
        this.targetAccount.setAmount(targetAmount + this.value);

        return right<string, boolean>(true);
    }

    public getOriginAccountAmount(): Either<string, number> {
        return right<string, number>(this.originAccount.getAmount());
    }

    public getTargetAccountAmount(): Either<string, number> {
        return right<string, number>(this.targetAccount.getAmount());
    }

    public getTransactionId(): Either<string, string> {
        return right<string, string>(this.id);
    }

    public getOriginId(): Either<string, string> {
        return right<string, string>(this.originAccount.getId());
    }

    public getTargetId(): Either<string, string> {
        return right<string, string>(this.targetAccount.getId());
    }

    public getDate(): Either<string, Date> {
        return right(this.date);
    }
}

