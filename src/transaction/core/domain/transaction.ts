import { left, right } from '../../../utils/either';
import { v4 as uuidv4 } from 'uuid';

export class Transaction {
    private readonly id: string;
    private readonly idOrigin: string;
    private amountOrigin: number;
    private readonly idSender: string;
    private readonly value: number;
    private amountSender: number;
    private date: Date;
    constructor(
        idOrigin: string,
        amountOrigin: number,
        idSender: string,
        amountSender: number,
        value: number,
    ) {
        this.id = uuidv4();
        this.idOrigin = idOrigin;
        this.idSender = idSender;
        this.value = value;
        this.amountOrigin = amountOrigin;
        this.amountSender = amountSender;
        this.date = new Date();
    }

    public execute() {
        if (this.value > this.amountOrigin) {
            return left<string, boolean>(
                'amount is greater than the balance in the account',
            );
        }

        this.amountOrigin -= this.value;
        this.amountSender += this.value;

        return right<string, boolean>(true);
    }

    public getTheAmountFromAccountOfOrigin() {
        return right<null, number>(this.amountOrigin);
    }

    public getTheAmountFromAccountSender() {
        return right<null, number>(this.amountSender);
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

    public getDate() {
        return this.date;
    }
}
