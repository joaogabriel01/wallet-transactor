import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Either, left } from '../utils/either';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
    ) {}

    async create(createWalletDto: CreateWalletDto): Promise<Either<string, number>> {
        const alreadyExists = await this.walletRepository.find({
            where: {
                name: createWalletDto.name
            }
        })
        if ( alreadyExists.length > 0) {
            return left('User already exists')
        }
        return left('Unexpected error when creating user');
    }

    findAll() {
        return `This action returns all wallet`;
    }

    findOne(id: number) {
        return `This action returns a #${id} wallet`;
    }

    update(id: number, updateWalletDto: UpdateWalletDto) {
        return `This action updates a #${id} wallet`;
    }

    remove(id: number) {
        return `This action removes a #${id} wallet`;
    }
}
