import { left, right } from '../../../utils/either';

export class Transaction {
    private readonly from: string;
    private readonly accountBalanceFrom: number;
    private readonly to: string;
    private readonly value: number;
    private readonly accountBalanceTo: number;
    constructor(
        from: string,
        accountBalancerFrom: number,
        to: string,
        accountBalanceTo: number,
        value: number,
    ) {
        this.from = from;
        this.to = to;
        this.value = value;
        this.accountBalanceFrom = accountBalancerFrom;
        this.accountBalanceTo = accountBalanceTo;
    }

    public execute() {
        if (this.value > this.accountBalanceFrom) {
            return left<string, boolean>(
                'amount is greater than the balance in the account',
            );
        }
        return right<string, boolean>(true);
    }
}
