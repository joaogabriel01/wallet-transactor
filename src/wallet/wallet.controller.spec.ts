import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';

describe('WalletController', () => {
    let controller: WalletController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WalletController],
            providers: [WalletService, {
                provide: getRepositoryToken(Wallet),
                useValue: {
                    find: jest.fn().mockResolvedValue([])
                }
            }],
        }).compile();

        controller = module.get<WalletController>(WalletController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
