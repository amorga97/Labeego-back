import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProjectDto } from 'src/project/dto/update-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
    const mockTaskToAdd = {
        title: "antonio's project",
    };

    let controller: TasksController;
    let service: TasksService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                {
                    provide: TasksService,
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

        controller = module.get<TasksController>(TasksController);
        service = module.get<TasksService>(TasksService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('When calling controller.create', () => {
        test('Then service.create should be called', async () => {
            await controller.create('', mockTaskToAdd as CreateTaskDto);
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
            await controller.update(
                'projectId',
                'taskId',
                mockTaskToAdd as UpdateProjectDto,
            );
            expect(service.update).toHaveBeenCalled();
        });
    });

    describe('When calling controller.remove', () => {
        test('Then service.findOne should be called', async () => {
            await controller.remove('Projectid', 'TaskID');
            expect(service.remove).toHaveBeenCalled();
        });
    });
});
