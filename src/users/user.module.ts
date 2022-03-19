import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCrudService } from './user.service';
import { UserController } from './user.controller';
import { userSchema } from '../models/user.model';
import { AuthService } from '../utils/auth.service';
import { Helpers } from '../utils/helpers.service';
import { chatSchema } from '../models/chat.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'User', schema: userSchema },
            { name: 'Chat', schema: chatSchema },
        ]),
    ],
    controllers: [UserController],
    providers: [UserCrudService, AuthService, Helpers],
})
export class UserCrudModule {}
