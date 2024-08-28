import { EssentialData } from './essential_account_data';
import { Transaction } from './transaction';

describe('Transaction Domain', () => {
    function runTest(
        transaction: Transaction,
        expectError: boolean,
        expectedResponse: boolean | Error,
        expectedAmountOrigin: number,
        expectedAmountSender: number,
        expectedIdOrigin: string,
        expectedIdSender: string,
    ) {
        expect(transaction.getOriginId().value).toBe(expectedIdOrigin);
        expect(transaction.getTargetId().value).toBe(expectedIdSender);
        const response = transaction.execute();
        expect(response.isLeft()).toBe(expectError);
        expect(response.value).toEqual(expectedResponse);
        if (response.isLeft()) {
            return;
        }
        const valueAccountOrigin = transaction.getOriginAccountAmount();
        expect(valueAccountOrigin.value).toBe(expectedAmountOrigin);
        const valueAccountSender = transaction.getTargetAccountAmount();
        expect(valueAccountSender.value).toBe(expectedAmountSender);
    }

    it('should return an error when the amount is greater than the balance in the account', () => {
        const transaction = new Transaction(
            new EssentialData('accountOrigin', 100),
            new EssentialData('accountSender', 10),
            1000,
        );
        runTest(
            transaction,
            true,
            new Error('amount is greater than the balance in the account'),
            0,
            0,
            'accountOrigin',
            'accountSender',
        );
    });

    it('should execute successfully when the amount is within the balance in the account', () => {
        const transaction = new Transaction(
            new EssentialData('accountOrigin', 100),
            new EssentialData('accountSender', 10),
            10,
        );
        runTest(
            transaction,
            false,
            true,
            90,
            20,
            'accountOrigin',
            'accountSender',
        );
    });
});
