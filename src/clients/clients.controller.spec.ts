import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

describe('ClientsController', () => {
    const mockClientToAdd = {
        name: 'Test',
        address: {
            street: 'Test',
            number: 'Test',
        },
        projects: [],
    };

    let controller: ClientsController;
    let service: ClientsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClientsController],
            providers: [
                {
                    provide: ClientsService,
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

        controller = module.get<ClientsController>(ClientsController);
        service = module.get<ClientsService>(ClientsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('When calling controller.create', () => {
        test('Then service.create should be called', async () => {
            await controller.create(mockClientToAdd as CreateClientDto);
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
            await controller.findOne('ClientId');
            expect(service.findOne).toHaveBeenCalled();
        });
    });

    describe('When calling controller.update', () => {
        test('Then service.update should be called', async () => {
            await controller.update(
                'ClientId',
                mockClientToAdd as UpdateClientDto,
            );
            expect(service.update).toHaveBeenCalled();
        });
    });

    describe('When calling controller.remove', () => {
        test('Then service.findOne should be called', async () => {
            await controller.remove('ClientId');
            expect(service.remove).toHaveBeenCalled();
        });
    });
});
