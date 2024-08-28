import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('WalletService', () => {
    let service: WalletService;
    let walletRepository: Repository<Wallet>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WalletService,
                {
                    provide: getRepositoryToken(Wallet),
                    useValue: {
                        find: jest.fn().mockResolvedValue([]),
                        findOne: jest.fn().mockResolvedValue(null),
                        save: jest.fn().mockResolvedValue(null),
                        create: jest.fn().mockResolvedValue(null),
                        findOneById: jest.fn().mockResolvedValue(null),
                        delete: jest.fn().mockRejectedValue(null),
                    },
                },
            ],
        }).compile();

        service = module.get<WalletService>(WalletService);
        walletRepository = module.get<Repository<Wallet>>(
            getRepositoryToken(Wallet),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(walletRepository).toBeDefined();
    });

    it('should return a unexpected error when repository throw error', async () => {
        const createDtoMock = {
            ballance: 10,
            document: '11111111111'
        };
        jest.spyOn(walletRepository, 'findOne').mockImplementationOnce(() => {
            throw new Error('Fake Exception');
        });

        await expect(service.create(createDtoMock)).rejects.toThrow(
            'Fake Exception',
        );
    });

    it('should return a error if the user exists', async () => {
        const createDtoMock = {
            ballance: 10,
            document: '11111111111'
        };
        const userMock = {
            id: '1',
            ballance: 10,
            document: '11111111111'
        };
        jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(userMock);
        const response = await service.create(createDtoMock);
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBeInstanceOf(Error);
        expect((response.value as Error).message).toBe('User already exists');
    });

    it('should return new id if the creation works', async () => {
        const createDtoMock = {
            ballance: 10,
            document: '11111111111'
        };
        jest.spyOn(walletRepository, 'save').mockImplementationOnce(
            async () => {
                return {
                    id: '1',
                    ...createDtoMock,
                };
            },
        );
        const response = await service.create(createDtoMock);
        expect(response.value).toBe('1');
        expect(response.isRight()).toBe(true);
    });

    it('should return all wallets', async () => {
        jest.spyOn(walletRepository, 'find').mockResolvedValue([
            { id: '1', ballance: 10, document: '11111111111' },
            { id: '2', ballance: 100, document: '11111111112' },
        ]);
        const wallets = await service.findAll();
        expect(wallets.isRight()).toBe(true);
        expect(wallets.value).toEqual([
            { id: '1',ballance: 10, document: '11111111111' },
            { id: '2',ballance: 100, document: '11111111112' },
        ]);
    });

    it('should return error when repository return error in findAll', async () => {
        jest.spyOn(walletRepository, 'find').mockImplementation(async () => {
            throw Error('Fake Exception');
        });

        await expect(service.findAll()).rejects.toThrow('Fake Exception');
    });

    it('should return a user in findOne', async () => {
        const walletExpected = { id: '1', ballance: 10, document: '11111111111' };
        jest.spyOn(walletRepository, 'findOneById').mockResolvedValue({
            id: '1',
            ballance: 10,
            document: '11111111111',
        });
        const wallet = await service.findOne('1');
        expect(wallet.isRight()).toBe(true);
        expect(wallet.value).toEqual(walletExpected);
    });

    it('should return error when repository return error in findOne', async () => {
        jest.spyOn(walletRepository, 'findOneById').mockImplementation(
            async () => {
                throw Error('Fake Exception');
            },
        );
        await expect(service.findOne('1')).rejects.toThrow('Fake Exception');
    });

    it('should return id in update wallet', async () => {
        const dataWallet = { ballance: 15, document: '11111111111' };
        jest.spyOn(walletRepository, 'findOneById').mockResolvedValue({
            id: '1',
            ballance: 10,
            document: '11111111111',
        });
        jest.spyOn(walletRepository, 'save').mockImplementationOnce(
            async (wallet: Wallet) => {
                return wallet;
            },
        );

        jest.spyOn(walletRepository, 'create').mockReturnValue({
            id: null,
            ballance: 10,
            document: '11111111111'
        });

        const walletId = await service.update('1', dataWallet);
        expect(walletId.isRight()).toBe(true);
        expect(walletId.value).toBe('1');
    });

    it('should return true when remove wallet', async () => {
        jest.spyOn(walletRepository, 'delete').mockResolvedValue({
            raw: null,
            affected: 1,
        });
        const worked = await service.remove('1');
        expect(worked.isRight()).toBe(true);
        expect(worked.value).toBe(true);
    });

    it('should return error when wallet repository in the delete method does not affect rows', async () => {
        jest.spyOn(walletRepository, 'delete').mockResolvedValue({
            raw: null,
            affected: 0,
        });
        const worked = await service.remove('1');
        expect(worked.isLeft()).toBe(true);
        expect(worked.value).toBeInstanceOf(Error);

        expect((worked.value as Error).message).toBe('Wallet not found for deletion');
    });

    it('should return a exception when wallet repository in the delete method does return a expection', async () => {
        jest.spyOn(walletRepository, 'delete').mockImplementation(async () => {
            throw Error('Fake Exception');
        });
        await expect(service.remove('1')).rejects.toThrow('Fake Exception');
    });
});
