import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../utils/either';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findOne(username: string): Promise<Either<string, User>> {
        const user = await this.userRepository.findOneBy({ username });
        if (user) {
            return right(user);
        }
        return left('User not found');
    }
}
