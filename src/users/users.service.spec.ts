import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
    let service: UsersService;
    let userRepository: Repository<User>;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOneBy: jest.fn().mockResolvedValue(null),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    it('should a error when user not found', async () => {
      const user = await service.findOne('1');
      expect(user.isLeft()).toBe(true);
      expect(user.value).toBe('User not found');
    });

    it('should a user', async () => {
      const userExpected = {
        id: '1',
        username: 'joao',
        password: '123'
      }
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(
        userExpected
      )
      const user = await service.findOne('1');
      expect(user.isRight()).toBe(true);
      expect(user.value).toEqual(userExpected)
    });
});
