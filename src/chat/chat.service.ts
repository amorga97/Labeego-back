import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { AuthService } from '../utils/auth.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ifChat } from '../models/chat.model';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel('Chat') private readonly Chat: Model<ifChat>,
        private readonly auth: AuthService,
    ) {}

    async findAll(token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        const chats = await this.Chat.find({
            users: { $in: { id: tokenData.id } },
        });
        if (!chats) throw new NotFoundException();
        return chats;
    }

    async findOne(id: string) {
        if (this.Chat.exists({ _id: id })) return await this.Chat.findById(id);
        throw new NotFoundException();
    }

    async update(id: string, newMessage: UpdateChatDto, token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        if (this.Chat.exists({ _id: id })) {
            return await this.Chat.findByIdAndUpdate(id, {
                messages: {
                    $push: {
                        messages: {
                            date: new Date(),
                            text: newMessage,
                            sender: tokenData.id,
                        },
                    },
                },
            });
        }
        throw new NotFoundException();
    }
}
