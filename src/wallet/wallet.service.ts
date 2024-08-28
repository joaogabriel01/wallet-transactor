import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Either, left, right } from '../utils/either';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletOutputDto } from './dto/wallet-output-dto';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
    ) {}

    async create(
        createWalletDto: CreateWalletDto,
    ): Promise<Either<Error, string>> {
        const alreadyExists = await this.walletRepository.findOne({
            where: {
                document: createWalletDto.document,
            },
        });
        if (alreadyExists) {
            return left(new Error('User already exists'));
        }

        const wallet = this.walletRepository.create(createWalletDto);
        const newWallet = await this.walletRepository.save(wallet);
        return right(newWallet.id);
    }

    async findAll(): Promise<Either<Error, WalletOutputDto[]>> {
        const allWalletsEntity = await this.walletRepository.find();
        const wallets: WalletOutputDto[] = [];
        for (let i = 0; i < allWalletsEntity.length; i++) {
            wallets.push(this.toWalletDto(allWalletsEntity[i]));
        }
        return right(wallets);
    }

    async findOne(id: string): Promise<Either<Error, WalletOutputDto>> {
        const wallet = await this.walletRepository.findOneById(id);
        if (!wallet) {
            return left(new Error('User not exists'));
        }
        return right(this.toWalletDto(wallet));
    }

    async update(
        id: string,
        updateWalletDto: UpdateWalletDto,
    ): Promise<Either<Error, string>> {
        const wallet = await this.walletRepository.findOneById(id);
        if (wallet) {
            const walletEntity =
                await this.walletRepository.create(updateWalletDto);
            walletEntity.id = id;
            const walletSaved = await this.walletRepository.save(walletEntity);
            return right(walletSaved.id);
        }
        return left(new Error('Wallet not found'));
    }

    async remove(id: string): Promise<Either<Error, boolean>> {
        const result = await this.walletRepository.delete(id);
        if (result.affected == 0) {
            return left(new Error('Wallet not found for deletion'));
        }
        return right(true);
    }

    toWalletDto(entity: Wallet): WalletOutputDto {
        const { id, ballance, document } = entity;
        return { id, ballance, document };
    }
}
