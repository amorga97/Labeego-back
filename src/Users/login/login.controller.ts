import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../utils/auth.service';
import { LoginService } from './login.service';

@Controller('users/login')
export class LoginController {
    constructor(
        private readonly LoginServ: LoginService,
        private readonly Auth: AuthService,
    ) {}

    @Post()
    async login(@Body() body: { password: string; userName: string }) {
        const secret = process.env.SECRET;
        const savedUser = await this.LoginServ.login(
            body.userName,
            body.password,
        );

        return this.Auth.createToken(savedUser.id, savedUser.admin, secret);
    }
}
