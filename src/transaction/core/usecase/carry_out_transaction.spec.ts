import { CarryOutTransaction } from './carry_out_transaction';
import { TransactionParameters } from 'src/transaction/dto/transaction_parameters';
import { Transaction } from '../domain/transaction';
import { left, Right, right } from '../../../utils/either';
import { EssentialData, IEssentialAccountData } from '../domain/essential_account_data';

jest.mock('../domain/transaction', () => {
    return {
        Transaction: jest.fn().mockImplementation(( originAccount: IEssentialAccountData,
            targetAccount: IEssentialAccountData,
            value: number,
            uuid?: string,) => {
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
        const originExpected  = new EssentialData('1', 1000)
        const targetExpected  = new EssentialData('2', 1000)
        expect(accountRepository.getByAmountId).toHaveBeenCalledTimes(2);
        expect(Transaction).toHaveBeenCalledWith(originExpected,targetExpected, 500);
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
        expect(transactionRepository.createTransaction).toHaveBeenCalledTimes(1);
        expect(result.value).toEqual('transaction was carried out sucessfully');
    });

});