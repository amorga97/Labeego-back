import { ForbiddenException } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { userSchema } from '../../models/user.model';
import { RegisterService } from './register.service';

describe('Given RegisterService', () => {
    let service: RegisterService;

    const mockUserToAdd = {
        userName: 'pepe',
        name: 'lopez',
        password: '12345',
        mail: 'pepemola@gmail.com',
        userImage: 'some url',
        projects: [],
    };

    const mockRepository = {
        create: jest.fn().mockResolvedValue(mockUserToAdd),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RegisterService],
            imports: [
                MongooseModule.forFeature([
                    { name: 'User', schema: userSchema },
                ]),
            ],
        })
            .overrideProvider(getModelToken('User'))
            .useValue(mockRepository)
            .compile();

        service = module.get<RegisterService>(RegisterService);
    });

    describe('When instanciating it ', () => {
        test('Then it should be defined', () => {
            expect(service).toBeDefined();
        });
    });

    describe('When calling it with valid params', () => {
        test('Then it should return the registered user', async () => {
            expect(await service.registerUser(mockUserToAdd)).toEqual(
                mockUserToAdd,
            );
        });
    });

    describe('When calling it with invalid or missing params', () => {
        test('Then it should throw an exception', () => {
            mockRepository.create.mockImplementation(async () => {
                throw new ForbiddenException();
            });
            expect(
                async () => await service.registerUser(mockUserToAdd),
            ).rejects.toThrow();
        });
    });
});
