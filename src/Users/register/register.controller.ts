import { Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ifUser } from 'src/models/user.model';
import { AuthService } from 'src/utils/auth.service';
import { RegisterService } from './register.service';

@Controller('users/register')
export class RegisterController {
    constructor(
        private readonly RegisterServ: RegisterService,
        private readonly Auth: AuthService,
    ) {}

    @Post()
    async registerUser(@Body() body: ifUser) {
        const userToSave = {
            ...body,
            password: bcrypt.hashSync(body.password, 10),
        };
        const savedUser = await this.RegisterServ.registerUser(userToSave);
        const secret = process.env.SECRET;
        return this.Auth.createToken(
            savedUser._id.toString(),
            savedUser.admin,
            secret,
        );
    }
}
