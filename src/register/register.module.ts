import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/models/user.model';
import { AuthService } from 'src/utils/auth.service';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    ],
    controllers: [RegisterController],
    providers: [RegisterService, AuthService],
})
export class RegisterModule {}
