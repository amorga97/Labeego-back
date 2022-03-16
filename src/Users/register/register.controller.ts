import { Body, Controller, Logger, Post } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ifUser } from '../../models/user.model';
import { AuthService } from '../../utils/auth.service';
import { RegisterService } from './register.service';

@Controller('users/register')
export class RegisterController {
    constructor(
        private readonly Service: RegisterService,
        private readonly Auth: AuthService,
    ) {}

    @Post()
    async registerUser(@Body() body: ifUser) {
        const logger = new Logger();
        const userToSave = {
            ...body,
            password: bcrypt.hashSync(body.password, 10),
        };
        const savedUser = await this.Service.registerUser(userToSave);

        logger.log(savedUser);
        const secret = process.env.SECRET;
        return this.Auth.createToken(
            savedUser._id.toString(),
            savedUser.admin,
            secret,
        );
    }
}
