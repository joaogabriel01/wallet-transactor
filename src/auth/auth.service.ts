import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Either, left, right } from '../utils/either';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(
        username: string,
        pass: string,
    ): Promise<Either<string, string>> {
        const messageUserIncorrect = 'Incorrect username or password';
        const user = await this.usersService.findOne(username);
        if (user.isLeft()) {
            return left(messageUserIncorrect);
        }
        const userValues = user.value;
        if (userValues?.password !== pass) {
            return left(messageUserIncorrect);
        }
        const { password, ...result } = userValues;
        const payload = { sub: userValues.id, username: userValues.username };
        const token = await this.jwtService.signAsync(payload);
        return right(token);
    }
}
