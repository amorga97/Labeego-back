import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { userSchema } from '../../models/user.model';

describe('Given LoginService', () => {
    let service: LoginService;

    const mockRepository = {
        findOne: jest.fn().mockResolvedValue({
            password:
                '$2a$10$5iHALdl/xQ77DSAVC1/NYOltXkTdNmzjPceW/Y3u5WYEigS9hyQG2',
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LoginService],
            imports: [
                MongooseModule.forFeature([
                    { name: 'User', schema: userSchema },
                ]),
            ],
        })
            .overrideProvider(getModelToken('User'))
            .useValue(mockRepository)
            .compile();

        service = module.get<LoginService>(LoginService);
    });

    describe('When instanciating it', () => {
        test('It should be defined', () => {
            expect(service).toBeDefined();
        });
    });

    describe('When it is called with a valid user and password', () => {
        test('Then it should return the saved user', async () => {
            expect(await service.login('pepe', '12345')).toEqual({
                password:
                    '$2a$10$5iHALdl/xQ77DSAVC1/NYOltXkTdNmzjPceW/Y3u5WYEigS9hyQG2',
            });
        });
    });

    describe('When calling it without a valid password', () => {
        test('Then it should throw an exception', async () => {
            expect(async () => {
                await service.login('pepe', '1234');
            }).rejects.toThrow();
        });
    });

    describe('When calling it without a registered name', () => {
        test('Then it should throw an exception', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            expect(async () => {
                await service.login('soler', '12345');
            }).rejects.toThrow();
        });
    });
});
