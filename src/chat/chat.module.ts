import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AuthService } from '../utils/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { chatSchema } from 'src/models/chat.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Chat', schema: chatSchema }]),
    ],
    controllers: [ChatController],
    providers: [ChatService, AuthService],
})
export class ChatModule {}
