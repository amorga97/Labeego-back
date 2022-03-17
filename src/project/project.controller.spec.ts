import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

describe('ProjectController', () => {
    const mockProjectToAdd = {
        title: "antonio's project",
        description: '',
        client: new Types.ObjectId('6231f8c42ba5d8994cfae7f2'),
    };

    let controller: ProjectController;
    let service: ProjectService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProjectController],
            providers: [
                {
                    provide: ProjectService,
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

        controller = module.get<ProjectController>(ProjectController);
        service = module.get<ProjectService>(ProjectService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('When calling controller.create', () => {
        test('Then service.create should be called', async () => {
            await controller.create(
                mockProjectToAdd as CreateProjectDto,
                'Bearer token',
            );
            expect(service.create).toHaveBeenCalled();
        });
    });

    describe('When calling controller.findall', () => {
        test('Then service.findAll should be called', async () => {
            await controller.findAll('Bearer token');
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('When calling controller.findOne', () => {
        test('Then service.findOne should be called', async () => {
            await controller.findOne('id', 'Bearer token');
            expect(service.findOne).toHaveBeenCalled();
        });
    });

    describe('When calling controller.update', () => {
        test('Then service.update should be called', async () => {
            await controller.update('id', {}, 'Bearer token');
            expect(service.update).toHaveBeenCalled();
        });
    });

    describe('When calling controller.remove', () => {
        test('Then service.findOne should be called', async () => {
            await controller.remove('id', 'Bearer token');
            expect(service.remove).toHaveBeenCalled();
        });
    });
});
