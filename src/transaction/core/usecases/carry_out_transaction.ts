import { TransactionParameters } from 'src/transaction/dto/transaction_parameters';
import { Transaction } from '../domain/transaction';
import { Either, left, right } from '../../../../src/utils/either';
import { EssentialData } from '../domain/essential_account_data';

export class CarryOutTransaction {
    private readonly transactionRepository;
    private readonly walletRepository;
    private readonly logger;
    constructor(
        transactionRepository: any,
        walletRepository: any,
        logger: any,
    ) {
        this.transactionRepository = transactionRepository;
        this.walletRepository = walletRepository;
        this.logger = logger;
    }

    public async execute(
        input: TransactionParameters,
    ): Promise<Either<Error, string>> {
        const { accountOriginId, accountSenderId, valueToTransfer } = input;
        const amountOrigin = this.walletRepository.getByAmountId();
        const amountSender = this.walletRepository.getByAmountId();

        const transaction = new Transaction(
            new EssentialData(accountOriginId, amountOrigin.value),
            new EssentialData(accountSenderId, amountSender.value),
            valueToTransfer,
        );
        const isSuccessTransaction = transaction.execute();
        if (isSuccessTransaction.isLeft()) {
            return left(new Error(isSuccessTransaction.value.message));
        }
        const transactionCreated =
            await this.transactionRepository.save(transaction);
        if (transactionCreated.isLeft()) {
            this.logger.log(transactionCreated.value.message);
            return left(
                new Error('transaction was not carried out successfully'),
            );
        }

        return right('transaction was carried out sucessfully');
    }
}
