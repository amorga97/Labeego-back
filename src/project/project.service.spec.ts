import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { projectSchema } from '../models/project.model';
import { userSchema } from '../models/user.model';
import { AuthService } from '../utils/auth.service';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
    let service: ProjectService;

    const mockProject = {
        _id: '6232f96e3d43d3a72c3bbb12',
        title: "antonio's project",
        description: 'This is a mock project to test the service',
        teamLeader: '6231f8c42ba5d8994cfae7f2',
        user: '6231f8c42ba5d8994cfae7f2',
        client: new Types.ObjectId('6231f8c42ba5d8994cfae7f2'),
        status: 'to do',
        lastUpdate: '2022-03-17T09:03:42.228Z',
        tasks: [],
    };

    const mockUser = {
        userName: 'pepe',
        name: 'lopez',
        password: '12345',
        mail: 'pepemola@gmail.com',
        userImage: 'some url',
        projects: [],
    };

    const mockAuth = {
        validateToken: jest.fn(),
    };

    const mockProjectRepository = {
        create: jest.fn().mockResolvedValue(mockProject),
        find: jest.fn().mockResolvedValue([mockProject]),
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn(),
    };

    const mockUserRepository = {
        create: jest.fn().mockResolvedValue(mockUser),
        find: jest.fn().mockResolvedValue([mockUser]),
        findById: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockUser),
            }),
        }),
        findByIdAndUpdate: jest
            .fn()
            .mockResolvedValue({ ...mockUser, userName: 'pepeMola24' }),
        findByIdAndDelete: jest.fn().mockResolvedValue(mockUser),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectService,
                { provide: AuthService, useValue: mockAuth },
            ],
            imports: [
                MongooseModule.forFeature([
                    { name: 'Project', schema: projectSchema },
                    {
                        name: 'User',
                        schema: userSchema,
                    },
                ]),
            ],
        })
            .overrideProvider(getModelToken('Project'))
            .useValue(mockProjectRepository)
            .overrideProvider(getModelToken('User'))
            .useValue(mockUserRepository)
            .compile();

        service = module.get<ProjectService>(ProjectService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('When calling service.create with a valid token', () => {
        test('Then it should return the created Project', async () => {
            mockAuth.validateToken.mockReturnValue({
                admin: false,
                id: '7d7d7d7d7d',
            });
            expect(await service.create(mockProject, 'token')).toBe(
                mockProject,
            );
        });
    });

    describe('When calling service.findAll as an admin', () => {
        test('Then it should return all projects of team members', async () => {
            mockProjectRepository.find.mockResolvedValue([mockProject]);
            mockAuth.validateToken.mockReturnValue({
                admin: true,
                id: '7d7d7d7d7d',
            });
            expect(await service.findAll('token')).toEqual([mockProject]);
            expect(mockProjectRepository.find).toHaveBeenCalledWith({
                teamLeader: '7d7d7d7d7d',
            });
        });
    });

    describe('When calling service.findAll as a regular user', () => {
        test('Then it should return all projects of that user', async () => {
            mockProjectRepository.find.mockResolvedValue([mockProject]);
            mockAuth.validateToken.mockReturnValue({
                admin: false,
                id: '7d7d7d7d7d',
            });
            expect(await service.findAll('token')).toEqual([mockProject]);
            expect(mockProjectRepository.find).toHaveBeenNthCalledWith(2, {
                user: '7d7d7d7d7d',
            });
        });
    });

    describe('When calling service.findOne as an admin', () => {
        test('Then it should return one of their teams projects', async () => {
            mockAuth.validateToken.mockReturnValue({
                admin: true,
                id: '7d7d7d7d7d',
            });
            mockProjectRepository.findOne.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockProject),
            });
            expect(await service.findOne('id', 'token')).toBe(mockProject);
            expect(mockProjectRepository.findOne).toHaveBeenCalledWith({
                _id: 'id',
                teamLeader: '7d7d7d7d7d',
            });
        });
    });

    describe('When calling service.findOne as a regular user', () => {
        test('Then it should return one of their projects', async () => {
            mockAuth.validateToken.mockReturnValue({
                admin: false,
                id: '7d7d7d7d7d',
            });
            mockProjectRepository.findOne.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockProject),
            });
            expect(await service.findOne('id', 'token')).toBe(mockProject);
            expect(mockProjectRepository.findOne).toHaveBeenCalledWith({
                _id: 'id',
                user: '7d7d7d7d7d',
            });
        });
    });

    describe('When calling service.findOne as a regular user, but with an invalid id', () => {
        test('Then it should throuw an exception', async () => {
            mockAuth.validateToken.mockReturnValue({
                admin: false,
                id: '7d7d7d7d7d',
            });
            mockProjectRepository.findOne.mockReturnValue({
                populate: jest.fn().mockResolvedValue(null),
            });
            expect(async () => {
                await service.findOne('id', 'token');
            }).rejects.toThrow();
        });
    });

    describe('When calling service.update as an admin', () => {
        test('Then it should return one of their teams projects', async () => {
            mockAuth.validateToken.mockReturnValue({
                admin: true,
                id: '7d7d7d7d7d',
            });
            mockProjectRepository.findOneAndUpdate.mockResolvedValue({
                ...mockProject,
                title: 'test',
            });
            expect(
                await service.update('id', { title: 'test' }, 'token'),
            ).toEqual({ ...mockProject, title: 'test' });
            expect(mockProjectRepository.findOneAndUpdate).toHaveBeenCalledWith(
                {
                    _id: 'id',
                    teamLeader: '7d7d7d7d7d',
                },
                {
                    title: 'test',
                    lastUpdate: new Date(),
                },
                { new: true },
            );
        });
    });

    describe('When calling service.update as an admin', () => {
        test('Then it should return one of their teams projects', async () => {
            mockAuth.validateToken.mockReturnValue({
                admin: false,
                id: '7d7d7d7d7d',
            });
            mockProjectRepository.findOneAndUpdate.mockResolvedValue({
                ...mockProject,
                title: 'test',
            });
            expect(
                await service.update('id', { title: 'test' }, 'token'),
            ).toEqual({ ...mockProject, title: 'test' });
            expect(mockProjectRepository.findOneAndUpdate).toHaveBeenCalledWith(
                {
                    _id: 'id',
                    user: '7d7d7d7d7d',
                },
                {
                    title: 'test',
                    lastUpdate: new Date(),
                },
                { new: true },
            );
        });
    });

    describe('When calling service.update with an invalid id', () => {
        test('Then it should throw an exception', async () => {
            mockAuth.validateToken.mockReturnValue({
                admin: false,
                id: '7d7d7d7d7d',
            });
            mockProjectRepository.findOneAndUpdate.mockRejectedValue(
                new Error('invalid id'),
            );

            expect(async () => {
                await service.update('id', { title: 'test' }, 'token');
            }).rejects.toThrow();
        });
    });

    describe('When calling service.remove as an admin', () => {
        test('Then it should return the deleted object', async () => {
            mockAuth.validateToken.mockReturnValue({
                admin: true,
                id: '7d7d7d7d7d',
            });
            mockProjectRepository.findOneAndDelete.mockResolvedValue(
                mockProject,
            );
            expect(await service.remove('id', 'token')).toEqual(mockProject);
            expect(mockProjectRepository.findOneAndDelete).toHaveBeenCalledWith(
                { _id: 'id', teamLeader: '7d7d7d7d7d' },
            );
        });
    });

    describe('When calling service.remove as a regular user', () => {
        test('Then it should return the deleted object', async () => {
            mockAuth.validateToken.mockReturnValue({
                admin: false,
                id: '7d7d7d7d7d',
            });
            mockProjectRepository.findOneAndDelete.mockResolvedValue(
                mockProject,
            );
            expect(await service.remove('id', 'token')).toEqual(mockProject);
            expect(mockProjectRepository.findOneAndDelete).toHaveBeenCalledWith(
                { _id: 'id', user: '7d7d7d7d7d' },
            );
        });
    });

    describe('When calling service.remove with the id of another users project', () => {
        test('Then it throw an exception', async () => {
            mockAuth.validateToken.mockReturnValue({
                admin: false,
                id: '7d7d7d7d7d',
            });
            mockProjectRepository.findOneAndDelete.mockResolvedValue(null);
            expect(async () => {
                await service.remove('id', 'token');
            }).rejects.toThrow();
        });
    });
});
