import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UpdateChatDto } from './dto/update-chat.dto';

describe('ChatController', () => {
    let controller: ChatController;
    let service: ChatService;

    const mockMessage = { text: 'test' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ChatController],
            providers: [
                {
                    provide: ChatService,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ChatController>(ChatController);
        service = module.get<ChatService>(ChatService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('When calling controller.findall', () => {
        test('Then service.findAll should be called', async () => {
            await controller.findAll('token');
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
                'ChatId',
                mockMessage as UpdateChatDto,
                'token',
            );
            expect(service.update).toHaveBeenCalled();
        });
    });
});
