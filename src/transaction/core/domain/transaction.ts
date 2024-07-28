import { left, right } from '../../../utils/either';
import { v4 as uuidv4 } from 'uuid';

export class Transaction {
    private readonly id: string;
    private readonly idOrigin: string;
    private accountOrigin: number;
    private readonly idSender: string;
    private readonly value: number;
    private accountSender: number;
    constructor(
        idOrigin: string,
        accountOrigin: number,
        idSender: string,
        accountSender: number,
        value: number,
    ) {
        this.id = uuidv4();
        this.idOrigin = idOrigin;
        this.idSender = idSender;
        this.value = value;
        this.accountOrigin = accountOrigin;
        this.accountSender = accountSender;
    }

    public execute() {
        if (this.value > this.accountOrigin) {
            return left<string, boolean>(
                'amount is greater than the balance in the account',
            );
        }

        this.accountOrigin -= this.value;
        this.accountSender += this.value;

        return right<string, boolean>(true);
    }

    public getTheAmountFromAccountOfOrigin() {
        return right<null, number>(this.accountOrigin);
    }

    public getTheAmountFromAccountSender() {
        return right<null, number>(this.accountSender);
    }

    public getIdTransaction() {
        return right<null, string>(this.id);
    }

    public getIdOrigin() {
        return right<null, string>(this.idOrigin);
    }

    public getIdSender() {
        return right<null, string>(this.idSender);
    }
}
