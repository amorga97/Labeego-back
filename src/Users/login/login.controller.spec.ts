import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { AuthService } from '../../utils/auth.service';

describe('Given the controller in login.controller.ts', () => {
    const mockLoginData = { password: '12345', userName: 'Pepe' };

    let controller: LoginController;
    let service: LoginService;
    let auth: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginController],
            providers: [
                {
                    provide: LoginService,
                    useValue: {
                        login: jest.fn().mockResolvedValue({
                            ...mockLoginData,
                            admin: false,
                        }),
                    },
                },
                { provide: AuthService, useValue: { createToken: jest.fn() } },
            ],
        }).compile();

        controller = module.get<LoginController>(LoginController);
        service = module.get<LoginService>(LoginService);
        auth = module.get<AuthService>(AuthService);
    });

    describe('When it is instanciated', () => {
        test('It should be defined', () => {
            expect(controller).toBeDefined();
        });
    });
    describe('When controller.login is called', () => {
        test('Then LoginService.Login should be called', async () => {
            await controller.login(mockLoginData);
            expect(service.login).toHaveBeenCalled();
        });
        test('And Auth.createToken should be called', async () => {
            await controller.login(mockLoginData);
            expect(auth.createToken).toHaveBeenCalled();
        });
    });
});
