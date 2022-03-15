import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCrudService } from './user-crud.service';
import { UserCrudController } from './user-crud.controller';
import { userSchema } from 'src/models/user.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    ],
    controllers: [UserCrudController],
    providers: [UserCrudService],
})
export class UserCrudModule {}
