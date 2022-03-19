import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../utils/auth.service';
import { chatSchema } from '../models/chat.model';
import { ChatService } from './chat.service';

describe('ChatService', () => {
    let service: ChatService;

    const mockAuth = {
        validateToken: jest
            .fn()
            .mockReturnValue({ id: '62349d0c23aaae0867a02a04' }),
    };

    const mockMessage = {
        text: 'test',
    };

    const mockChat = {
        messages: [],
        users: [
            {
                _id: '6232f80eba46c1aabbce7753',
                name: 'pablo',
                __v: 0,
            },
            {
                _id: '62349d0c23aaae0867a02a04',
                name: 'patricia',
                __v: 0,
            },
        ],
        teamLeader: '6231f8c42ba5d8994cfae7f2',
    };

    const mockRepository = {
        findByIdAndUpdate: jest
            .fn()
            .mockResolvedValue({ ...mockChat, messages: [mockMessage] }),
        findById: jest.fn().mockResolvedValue(mockChat),
        find: jest.fn().mockResolvedValue([mockChat]),
        exists: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forFeature([
                    { name: 'Chat', schema: chatSchema },
                ]),
            ],
            providers: [
                ChatService,
                { provide: AuthService, useValue: mockAuth },
            ],
        })
            .overrideProvider(getModelToken('Chat'))
            .useValue(mockRepository)
            .compile();

        service = module.get<ChatService>(ChatService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('When calling service.findAll', () => {
        test('Then it should return all chats in the db', async () => {
            expect(await service.findAll('token')).toHaveLength(1);
        });
    });

    describe('When calling service.findAll with invalid id in token', () => {
        test('Then it should throw an exception', async () => {
            mockRepository.find.mockResolvedValue([]);
            expect(async () => {
                await service.findAll('token');
            }).rejects.toThrow();
        });
    });

    describe('When calling service.findOne', () => {
        test('Then it should return all chats in the db', async () => {
            mockRepository.exists.mockResolvedValue(true);
            expect(await service.findOne('id')).toBe(mockChat);
        });
    });

    describe('When calling service.findOne with an invalid id', () => {
        test('Then it should throw an exception', async () => {
            mockRepository.exists.mockResolvedValue(false);
            expect(async () => await service.findOne('id')).rejects.toThrow();
        });
    });

    describe('When calling service.update with a valid chatId', () => {
        test('Then it should return the updated chat', async () => {
            mockRepository.exists.mockResolvedValue(true);
            expect(
                await service.update('ChatId', mockMessage, 'token'),
            ).toEqual({
                ...mockChat,
                messages: [mockMessage],
            });
        });
    });

    describe('When calling service.update with a invalid chatId', () => {
        test('Then it should return the updated chat', async () => {
            mockRepository.exists.mockResolvedValue(false);
            expect(async () => {
                await service.update('ChatId', mockMessage, 'token');
            }).rejects.toThrow();
        });
    });
});
