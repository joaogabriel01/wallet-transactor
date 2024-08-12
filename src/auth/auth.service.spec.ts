import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { right } from '../utils/either';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest
                            .fn()
                            .mockReturnValue('mocked_jwt_token'),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        findOne: jest.fn().mockReturnValue(
                            right({
                                id: '1',
                                username: 'joao',
                                password: '123',
                            }),
                        ),
                    },
                },
            ],
        }).compile();
        jwtService = module.get<JwtService>(JwtService);
        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(jwtService).toBeDefined();
        expect(usersService).toBeDefined();
    });

    it('should return a left when user is incorrect', async () => {
        jest.spyOn(usersService, 'findOne').mockResolvedValue(
            right({
                id: '1',
                username: 'joao',
                password: '1234',
            }),
        );
        const token = await service.signIn('joao', '123');
        expect(token.isLeft()).toBe(true);
        expect(token.value).toBe('Incorrect username or password');
    });

    it('should return the token when everything goes well', async () => {
        const token = await service.signIn('joao', '123');
        expect(token.isRight()).toBe(true);
        expect(token.value).toBe('mocked_jwt_token');
    });
});
