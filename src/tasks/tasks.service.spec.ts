import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { projectSchema } from '../models/project.model';
import { taskSchema } from '../models/task.model';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
    let service: TasksService;

    const mockProjectRepository = {
        findByIdAndUpdate: jest.fn(),
        exists: jest.fn(),
    };

    const mockTask = {
        title: 'Test task',
        project: '62334fe5e4c02fec0d68d182',
        status: 'to do',
        _id: '6233512806236f49a2938a1a',
    };

    const mockTaskRepository = {
        create: jest.fn().mockResolvedValue(mockTask),
        find: jest.fn().mockResolvedValue([mockTask]),
        findById: jest.fn().mockResolvedValue(mockTask),
        findByIdAndUpdate: jest
            .fn()
            .mockResolvedValue({ ...mockTask, title: 'updated task' }),
        findByIdAndDelete: jest.fn().mockResolvedValue(mockTask),
        exists: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TasksService],
            imports: [
                MongooseModule.forFeature([
                    { name: 'Project', schema: projectSchema },
                    {
                        name: 'Task',
                        schema: taskSchema,
                    },
                ]),
            ],
        })
            .overrideProvider(getModelToken('Task'))
            .useValue(mockTaskRepository)
            .overrideProvider(getModelToken('Project'))
            .useValue(mockProjectRepository)
            .compile();

        service = module.get<TasksService>(TasksService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('When calling service.create with a valid projectId', () => {
        test('Then it should return the new task', async () => {
            mockProjectRepository.exists.mockResolvedValue(true);
            expect(
                await service.create('projectID', { title: 'Test task' }),
            ).toBe(mockTask);
        });
    });

    describe('When calling service.create with an inexistent projectId', () => {
        test('Then it should throw an exception', async () => {
            mockProjectRepository.exists.mockResolvedValue(false);
            expect(async () => {
                await service.create('projectID', { title: 'Test task' });
            }).rejects.toThrow();
        });
    });

    describe('When calling service.findAll with a valid projectId', () => {
        test('Then it should return the tasks of that project', async () => {
            mockProjectRepository.exists.mockResolvedValue(true);
            expect(await service.findAll('projectId')).toEqual([mockTask]);
        });
    });

    describe('When calling service.findAll with an inexistent projectId', () => {
        test('Then it should return the tasks of that project', async () => {
            mockProjectRepository.exists.mockResolvedValue(false);
            expect(async () => {
                await service.findAll('projectId');
            }).rejects.toThrow();
        });
    });

    describe('When calling service.findOne with valid projectId and taskID', () => {
        test('Then it should return the task', async () => {
            mockProjectRepository.exists.mockResolvedValue(true);
            mockTaskRepository.exists.mockResolvedValue(true);
            expect(await service.findOne('projectId', 'taskId')).toBe(mockTask);
        });
    });

    describe('When calling service.findOne with an inexistent projectId', () => {
        test('Then it should return the task', async () => {
            mockProjectRepository.exists.mockResolvedValue(false);
            mockTaskRepository.exists.mockResolvedValue(true);

            expect(async () => {
                await service.findOne('projectId', 'taskId');
            }).rejects.toThrow();
        });
    });

    describe('When calling service.findOne with an inexistent taskId', () => {
        test('Then it should return the task', async () => {
            mockProjectRepository.exists.mockResolvedValue(true);
            mockTaskRepository.exists.mockResolvedValue(false);

            expect(async () => {
                await service.findOne('projectId', 'taskId');
            }).rejects.toThrow();
        });
    });

    describe('When calling service.update with a valid projectId and taskId', () => {
        test('Then it should return the updated task', async () => {
            mockProjectRepository.exists.mockResolvedValue(true);
            mockTaskRepository.exists.mockResolvedValue(true);
            expect(
                await service.update('projectId', 'taskId', {
                    title: 'updated task',
                }),
            ).toEqual({ ...mockTask, title: 'updated task' });
        });
    });

    describe('When calling service.update with an inexistent projectId', () => {
        test('Then it should return the task', async () => {
            mockProjectRepository.exists.mockResolvedValue(false);
            mockTaskRepository.exists.mockResolvedValue(true);

            expect(async () => {
                await service.update('projectId', 'taskId', {
                    title: 'updated task',
                });
            }).rejects.toThrow();
        });
    });

    describe('When calling service.update with an inexistent taskId', () => {
        test('Then it should return the task', async () => {
            mockProjectRepository.exists.mockResolvedValue(true);
            mockTaskRepository.exists.mockResolvedValue(false);

            expect(async () => {
                await service.update('projectId', 'taskId', {
                    title: 'updated task',
                });
            }).rejects.toThrow();
        });
    });

    describe('When calling service.remove with a valid projectId and taskId', () => {
        test('Then it should return the deleted task', async () => {
            mockProjectRepository.exists.mockResolvedValue(true);
            mockTaskRepository.exists.mockResolvedValue(true);
            expect(await service.remove('projectId', 'taskId')).toBe(mockTask);
        });
    });

    describe('When calling service.remove with an inexistent projectId', () => {
        test('Then it should return the task', async () => {
            mockProjectRepository.exists.mockResolvedValue(false);
            mockTaskRepository.exists.mockResolvedValue(true);

            expect(async () => {
                await service.remove('projectId', 'taskId');
            }).rejects.toThrow();
        });
    });

    describe('When calling service.remove with an inexistent taskId', () => {
        test('Then it should return the task', async () => {
            mockProjectRepository.exists.mockResolvedValue(true);
            mockTaskRepository.exists.mockResolvedValue(false);

            expect(async () => {
                await service.remove('projectId', 'taskId');
            }).rejects.toThrow();
        });
    });
});
