import { Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ifUser } from '../models/user.model';
import { AuthService } from '../utils/auth.service';
import { RegisterService } from './register.service';

@Controller('/register')
export class RegisterController {
    constructor(
        private readonly Service: RegisterService,
        private readonly Auth: AuthService,
    ) {}

    @Post()
    async registerUser(@Body() body: ifUser) {
        const userToSave = {
            ...body,
            password: bcrypt.hashSync(body.password, 10),
        };
        const savedUser = await this.Service.registerUser(userToSave);
        const secret = process.env.SECRET;
        const token = this.Auth.createToken(
            savedUser._id.toString(),
            savedUser.admin,
            secret,
        );
        return {
            id: savedUser._id,
            name: savedUser.name,
            userName: savedUser.userName,
            teamLeader: savedUser.teamLeader,
            mail: savedUser.mail,
            token,
        };
    }
}
