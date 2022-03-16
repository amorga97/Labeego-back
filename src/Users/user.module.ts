import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCrudService } from './user.service';
import { UserCrudController } from './user.controller';
import { userSchema } from 'src/models/user.model';
import { AuthService } from 'src/utils/auth.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    ],
    controllers: [UserCrudController],
    providers: [UserCrudService, AuthService],
})
export class UserCrudModule {}
