import { CarryOutTransaction } from './carry_out_transaction';
import { TransactionParameters } from 'src/transaction/dto/transaction_parameters';
import { Transaction } from '../domain/transaction';
import { left, right } from '../../../utils/either';

jest.mock('../domain/transaction', () => {
    return {
        Transaction: jest.fn().mockImplementation((originId, originAmount, senderId, senderAmount, value) => {
            return {
                execute: jest.fn(() => {
                    return { isLeft: () => false };
                })
            };
        })
    };
});

describe('CarryOutTransaction', () => {
    let transactionRepository: any;
    let accountRepository: any;
    let carryOutTransaction: CarryOutTransaction;
    let logger: any;


    it('should execute a transaction failled', async () => {
        logger = {
            log: jest.fn()
        }
        transactionRepository = {
            createTransaction: jest.fn().mockResolvedValue(left<string, string>('Transaction failled'))
        };
        accountRepository = {
            getByAmountId: jest.fn().mockReturnValue(right<null, number>(1000))
        };
        carryOutTransaction = new CarryOutTransaction(transactionRepository, accountRepository, logger);
        const params: TransactionParameters = {
            accountOriginId: '1',
            accountSenderId: '2',
            valueToTransfer: 500
        };

        const result = await carryOutTransaction.execute(params);

        expect(accountRepository.getByAmountId).toHaveBeenCalledTimes(2);
        expect(Transaction).toHaveBeenCalledWith("1", {"value": 1000}, "2", {"value": 1000}, 500);
        expect(transactionRepository.createTransaction).toHaveBeenCalledTimes(1);
        expect(logger.log).toHaveBeenCalledTimes(1);
        expect(logger.log).toHaveBeenCalledWith('Transaction failled');
        expect(result.value).toEqual('transaction was not carried out successfully');
    });


    it('should execute a transaction successfully', async () => {
        logger = {
            log: jest.fn()
        }
        transactionRepository = {
            createTransaction: jest.fn().mockResolvedValue(right<null, string>('Transaction successfully created'))
        };
        accountRepository = {
            getByAmountId: jest.fn().mockReturnValue(right<null, number>(1000))
        };
        carryOutTransaction = new CarryOutTransaction(transactionRepository, accountRepository, logger);
        const params: TransactionParameters = {
            accountOriginId: '1',
            accountSenderId: '2',
            valueToTransfer: 500
        };

        const result = await carryOutTransaction.execute(params);

        expect(accountRepository.getByAmountId).toHaveBeenCalledTimes(2);
        expect(Transaction).toHaveBeenCalledWith("1", {"value": 1000}, "2", {"value": 1000}, 500);
        expect(transactionRepository.createTransaction).toHaveBeenCalledTimes(1);
        expect(result.value).toEqual('transaction was carried out sucessfully');
    });

});