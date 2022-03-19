import { Controller, Get, Body, Patch, Param, Headers } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get()
    findAll(@Headers('Authorization') token: string) {
        return this.chatService.findAll(token);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.chatService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateChatDto: UpdateChatDto,
        @Headers('Authorization') token: string,
    ) {
        return this.chatService.update(id, updateChatDto, token);
    }
}
