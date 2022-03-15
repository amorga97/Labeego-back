import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/models/user.model';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    ],
    controllers: [RegisterController],
    providers: [RegisterService],
})
export class RegisterModule {}
