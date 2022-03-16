import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../utils/auth.service';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

describe('Given RegisterController', () => {
    let controller: RegisterController;
    let service: RegisterService;
    let auth: AuthService;

    const mockUserData = {
        _id: '1234567',
        admin: false,
    };

    const mockUserToAdd = {
        userName: 'pepe',
        surname: 'lopez',
        password: '12345',
        mail: 'pepemola@gmail.com',
        userImage: 'some url',
        projects: [],
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RegisterController],
            providers: [
                {
                    provide: RegisterService,
                    useValue: {
                        registerUser: jest.fn().mockResolvedValue(mockUserData),
                    },
                },
                {
                    provide: AuthService,
                    useValue: {
                        createToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<RegisterController>(RegisterController);
        service = module.get<RegisterService>(RegisterService);
        auth = module.get<AuthService>(AuthService);
    });

    describe('When instanciating it', () => {
        test('It should be defined', () => {
            expect(controller).toBeDefined();
        });
    });

    describe('When calling it with valid user params', () => {
        test('Then service.registerUser should be called', async () => {
            await controller.registerUser(mockUserToAdd);
            expect(service.registerUser).toHaveBeenCalled();
        });
        test('And auth.createToken should be called', async () => {
            await controller.registerUser(mockUserToAdd);
            expect(auth.createToken).toHaveBeenCalled();
        });
    });
});
