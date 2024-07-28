import { Transaction } from './transaction';

describe('Transaction Domain', () => {
    function runTest(
        transaction: Transaction,
        expectError: boolean,
        expectedResponse: boolean | string,
        expectedAmountOrigin: number,
        expectedAmountSender: number,
        expectedIdOrigin: string,
        expectedIdSender: string,
    ) {
        expect(transaction.getIdOrigin().value).toBe(expectedIdOrigin);
        expect(transaction.getIdSender().value).toBe(expectedIdSender);
        const response = transaction.execute();
        expect(response.isLeft()).toBe(expectError);
        expect(response.value).toBe(expectedResponse);
        if (response.isLeft()) {
            return;
        }
        const valueAccountOrigin =
            transaction.getTheAmountFromAccountOfOrigin();
        expect(valueAccountOrigin.value).toBe(expectedAmountOrigin);
        const valueAccountSender = transaction.getTheAmountFromAccountSender();
        expect(valueAccountSender.value).toBe(expectedAmountSender);
    }

    it('should return an error when the amount is greater than the balance in the account', () => {
        const transaction = new Transaction(
            'accountOrigin',
            100,
            'accountSender',
            10,
            1000,
        );
        runTest(
            transaction,
            true,
            'amount is greater than the balance in the account',
            0,
            0,
            'accountOrigin',
            'accountSender',
        );
    });

    it('should execute successfully when the amount is within the balance in the account', () => {
        const transaction = new Transaction(
            'accountOrigin',
            100,
            'accountSender',
            10,
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
