import { TransactionParameters } from 'src/transaction/dto/transaction_parameters';
import { Transaction } from '../domain/transaction';
import { left, right } from '../../../../src/utils/either';
import { EssentialData } from '../domain/essential_account_data';

export class CarryOutTransaction {
    private readonly transactionRepository;
    private readonly accountRepository;
    private readonly logger;
    constructor(
        transactionRepository: any,
        accountRepository: any,
        logger: any,
    ) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.logger = logger;
    }

    public async execute(input: TransactionParameters) {
        const { accountOriginId, accountSenderId, valueToTransfer } = input;
        const amountOrigin = this.accountRepository.getByAmountId();
        const amountSender = this.accountRepository.getByAmountId();

        const transaction = new Transaction(
            new EssentialData(accountOriginId, amountOrigin.value),
            new EssentialData(accountSenderId, amountSender.value),
            valueToTransfer,
        );
        const isSuccessTransaction = transaction.execute();
        if (isSuccessTransaction.isLeft()) {
            return isSuccessTransaction;
        }
        const transactionCreated =
            await this.transactionRepository.createTransaction(transaction);
        if (transactionCreated.isLeft()) {
            this.logger.log(transactionCreated.value);
            return left<string, null>(
                'transaction was not carried out successfully',
            );
        }

        return right<null, string>('transaction was carried out sucessfully');
    }
}
