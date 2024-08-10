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
                        save: jest.fn().mockResolvedValue([]),
                        create: jest.fn().mockResolvedValue([]),
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

    it('should return a unexpected error when creating user', async () => {
        const createDtoMock = {
            ballance: 10,
            name: 'João',
            password: '123',
        };
        jest.spyOn(walletRepository, 'find').mockImplementationOnce(() => {
            throw new Error('Fake Error');
        });
        const response = await service.create(createDtoMock);
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBe(
            'Unexpected error when creating user: Fake Error',
        );
    });

    it('should return a error if the user exists', async () => {
        const createDtoMock = {
            ballance: 10,
            name: 'João',
            password: '123',
        };
        const userMock = {
            id: 1,
            ballance: 10,
            name: 'João',
        };
        jest.spyOn(walletRepository, 'find').mockResolvedValueOnce([userMock]);
        const response = await service.create(createDtoMock);
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBe('User already exists');
    });

    it('should return new id if the creation works', async () => {
        const createDtoMock = {
            ballance: 10,
            name: 'João',
            password: '123',
        };
        jest.spyOn(walletRepository, 'save').mockImplementationOnce(
            async () => {
                return {
                    id: 1,
                    ...createDtoMock,
                };
            },
        );
        const response = await service.create(createDtoMock);
        expect(response.value).toBe(1);
        expect(response.isRight()).toBe(true);
    });

    it('should return all wallets', async () => {
        jest.spyOn(walletRepository, 'find').mockResolvedValue([
            { id: 1, ballance: 10, name: 'João', password: '123' },
            { id: 2, ballance: 100, name: 'João', password: '1234' },
        ]);
        const wallets = await service.findAll();
        expect(wallets.isRight()).toBe(true);
        expect(wallets.value).toEqual([
            { id: 1, ballance: 10, name: 'João' },
            { id: 2, ballance: 100, name: 'João' },
        ]);
    });
});
