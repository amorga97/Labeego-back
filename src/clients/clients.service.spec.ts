import { ForbiddenException } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { clientSchema } from '../models/client.model';
import { ClientsService } from './clients.service';

describe('ClientsService', () => {
    let service: ClientsService;

    const mockClient = {
        address: {
            street: 'Test',
            number: 23,
        },
        name: 'Test',
        phone: [],
        projects: [],
    };

    const mockRepository = {
        create: jest.fn().mockResolvedValue(mockClient),
        find: jest.fn().mockResolvedValue([mockClient]),
        findById: jest.fn().mockResolvedValue(mockClient),
        findByIdAndUpdate: jest
            .fn()
            .mockResolvedValue({ ...mockClient, name: 'updated Test' }),
        findByIdAndDelete: jest.fn().mockResolvedValue(mockClient),
        exists: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ClientsService],
            imports: [
                MongooseModule.forFeature([
                    { name: 'Client', schema: clientSchema },
                ]),
            ],
        })
            .overrideProvider(getModelToken('Client'))
            .useValue(mockRepository)
            .compile();

        service = module.get<ClientsService>(ClientsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('When calling service.create with valid params', () => {
        test('Then it should return the created Client', async () => {
            expect(await service.create(mockClient)).toBe(mockClient);
        });
    });

    describe('When calling service.create with invalid params', () => {
        test('Then it should throw an exception', async () => {
            mockRepository.create.mockRejectedValue(new ForbiddenException());
            expect(async () => {
                await service.create(mockClient);
            }).rejects.toThrow();
        });
    });

    describe('When calling service.findAll', () => {
        test('Then it should return all clients in the db', async () => {
            expect(await service.findAll()).toHaveLength(1);
        });
    });

    describe('When calling service.update with a valid clientId', () => {
        test('Then it should return the updated client', async () => {
            mockRepository.exists.mockResolvedValue(true);
            expect(
                await service.update('clientId', {
                    ...mockClient,
                    name: 'updated Test',
                }),
            ).toEqual({ ...mockClient, name: 'updated Test' });
        });
    });

    describe('When calling service.update with an invalid clientId', () => {
        test('Then it should throw an exception', async () => {
            mockRepository.exists.mockResolvedValue(false);
            expect(async () => {
                await service.update('clientId', {
                    ...mockClient,
                    name: 'updated Test',
                });
            }).rejects.toThrow();
        });
    });

    describe('When calling service.remove with a valid clientId', () => {
        test('Then it should return the deleted user', async () => {
            mockRepository.exists.mockResolvedValue(true);
            expect(await service.remove('clientId')).toBe(mockClient);
        });
    });

    describe('When calling service.remove with an invalid clientId', () => {
        test('Then it should throw an exception', async () => {
            mockRepository.exists.mockResolvedValue(false);
            expect(async () => {
                await service.remove('clientId');
            }).rejects.toThrow();
        });
    });
});
