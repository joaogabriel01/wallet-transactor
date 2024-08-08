import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('WalletService', () => {
    let service: WalletService;
    let walletRepository: Repository<Wallet>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [WalletService, {
                provide: getRepositoryToken(Wallet),
                useValue: {
                    find: jest.fn().mockResolvedValue([])
                }
            }],
        }).compile();

        service = module.get<WalletService>(WalletService);
        walletRepository = module.get<Repository<Wallet>>(getRepositoryToken(Wallet));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(walletRepository).toBeDefined();
    })

    it('should return a unexpected error when creating user', async () => {
        const createDtoMock = {
            ballance: 10, 
            name: "João",
            password: "123"
        }
        const response = await service.create(createDtoMock)
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBe("Unexpected error when creating user")
    });

    it('should return a error if the user exists', async () => {
        const createDtoMock = {
            ballance: 10, 
            name: "João",
            password: "123"
        }
        const userMock = {
            id: 1,
            ballance: 10, 
            name: "João",
        }
        jest.spyOn(walletRepository, 'find').mockResolvedValueOnce([userMock]);
        const response = await service.create(createDtoMock)
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBe("User already exists")
    });
});
