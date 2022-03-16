import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user-crud.dto';
import { UserController } from './user.controller';
import { UserCrudService } from './user.service';

describe('UserCrudController', () => {
    const mockUserToAdd = {
        userName: 'pepemola24',
        name: 'Pepe',
        password: '12345',
        mail: 'pepemola@gmail.com',
        userImage: 'some url',
        projects: [],
    };

    let controller: UserController;
    let service: UserCrudService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserCrudService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserCrudService>(UserCrudService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('When calling controller.create', () => {
        test('Then service.create should be called', async () => {
            await controller.create(mockUserToAdd as CreateUserDto, '');
            expect(service.create).toHaveBeenCalled();
        });
    });

    describe('When calling controller.findall', () => {
        test('Then service.findAll should be called', async () => {
            await controller.findAll();
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('When calling controller.findOne', () => {
        test('Then service.findOne should be called', async () => {
            await controller.findOne('');
            expect(service.findOne).toHaveBeenCalled();
        });
    });

    describe('When calling controller.update', () => {
        test('Then service.update should be called', async () => {
            await controller.update('', {});
            expect(service.update).toHaveBeenCalled();
        });
    });

    describe('When calling controller.remove', () => {
        test('Then service.findOne should be called', async () => {
            await controller.remove('', '');
            expect(service.remove).toHaveBeenCalled();
        });
    });
});
