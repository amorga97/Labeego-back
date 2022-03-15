import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/models/user.model';
import { AuthService } from 'src/utils/auth.service';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    ],
    controllers: [LoginController],
    providers: [LoginService, AuthService],
})
export class LoginModule {}
