import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../utils/auth.service';
import { userSchema } from '../models/user.model';
import { UserCrudService } from './user.service';
import { NotFoundException } from '@nestjs/common';

describe('UserCrudService', () => {
    const mockUser = {
        userName: 'pepe',
        name: 'lopez',
        password: '12345',
        mail: 'pepemola@gmail.com',
        userImage: 'some url',
        projects: [],
    };

    let service: UserCrudService;

    const mockRepository = {
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

    const mockAuth = {
        validateToken: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserCrudService,
                {
                    provide: AuthService,
                    useValue: mockAuth,
                },
            ],
            imports: [
                MongooseModule.forFeature([
                    { name: 'User', schema: userSchema },
                ]),
            ],
        })
            .overrideProvider(getModelToken('User'))
            .useValue(mockRepository)
            .compile();

        service = module.get<UserCrudService>(UserCrudService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('When calling service.create with an admin token', () => {
        test('Then it should return the created user', async () => {
            mockAuth.validateToken.mockReturnValue({ admin: true });
            expect(await service.create(mockUser, '')).toEqual(mockUser);
        });
    });

    describe('When calling service.create with a non-admin token', () => {
        test('Then it should throw an exception', () => {
            mockAuth.validateToken.mockReturnValue({ admin: false });
            expect(async () => {
                await service.create(mockUser, '');
            }).rejects.toThrow();
        });
    });

    describe('When calling service.findAll', () => {
        test('Then it should return an array of users', async () => {
            expect(await service.findAll()).toEqual([mockUser]);
        });
    });

    describe('When calling service.findOne with a valid id', () => {
        test('Then it should return a User', async () => {
            expect(await service.findOne('')).toBe(mockUser);
        });
    });

    describe('When calling service.findOne with the id of an inexistent user', () => {
        test('Then it should throw an exception', async () => {
            mockRepository.findById.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockImplementation(async () => {
                        throw new NotFoundException();
                    }),
                }),
            });
            expect(async () => {
                await service.findOne('');
            }).rejects.toThrow();
        });
    });

    describe('When calling service.update with a valid id and params', () => {
        test('Then it should return the user updated', async () => {
            expect(
                await service.update('', { userName: 'pepeMola24' }),
            ).toEqual({
                ...mockUser,
                userName: 'pepeMola24',
            });
        });
    });

    describe('When calling service.update with the id of an inexistent user', () => {
        test('Then it should throw an exception', async () => {
            mockRepository.findByIdAndUpdate.mockImplementationOnce(
                async () => {
                    throw new NotFoundException();
                },
            );

            expect(async () => {
                await service.update('', { userName: 'pepeMola24' });
            }).rejects.toThrow();
        });
    });

    describe('When calling service.remove with a valid id and an admin token', () => {
        test('Then it should return the deleted user', async () => {
            mockAuth.validateToken.mockReturnValue({ admin: true });
            const removeResponse = await service.remove(
                'testId',
                'bearer testToken',
            );

            expect(removeResponse).toEqual(mockUser);
            expect(mockRepository.findByIdAndUpdate).toHaveBeenCalledTimes(4);
        });
    });

    describe('When calling service.remove with a valid id and a non-admin token', () => {
        test('Then it should return the deleted user', async () => {
            mockAuth.validateToken.mockReturnValue({ admin: false });
            const removeResponse = await service.remove(
                'testId',
                'bearer testToken',
            );

            expect(removeResponse).toEqual(mockUser);
            expect(mockRepository.findByIdAndUpdate).toHaveBeenCalledTimes(4);
        });
    });

    describe('When calling service.remove with an invalid id', () => {
        test('Then it should throw an exception', () => {
            mockRepository.findByIdAndDelete.mockImplementation(async () => {
                throw new NotFoundException();
            });

            expect(async () => {
                await service.remove('testBadId', 'bearer testToken');
            }).rejects.toThrow();
        });
    });
});
