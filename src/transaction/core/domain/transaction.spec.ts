import { Transaction } from './transaction';

describe('Transaction Domain', () => {
    function runTest(transaction, expectError, expectedResponse) {
        const response = transaction.execute();
        expect(response.isLeft()).toBe(expectError);
        expect(response.value).toBe(expectedResponse);
    }

    it('should return an error when the amount is greater than the balance in the account', () => {
        const transaction = new Transaction(
            'accountFrom',
            100,
            'accountTo',
            10,
            1000,
        );
        runTest(
            transaction,
            true,
            'amount is greater than the balance in the account',
        );
    });

    it('should execute successfully when the amount is within the balance in the account', () => {
        const transaction = new Transaction(
            'accountFrom',
            100,
            'accountTo',
            10,
            10,
        );
        runTest(transaction, false, true);
    });
});
