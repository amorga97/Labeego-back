import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/utils/auth.service';
import { LoginService } from './login.service';

@Controller('users/login')
export class LoginController {
    constructor(
        private readonly LoginServ: LoginService,
        private readonly Auth: AuthService,
    ) {}

    @Post()
    async login(@Body() body: { password: string; userName: string }) {
        const savedUser = await this.LoginServ.login(
            body.userName,
            body.password,
        );
        const secret = process.env.SECRET;

        return this.Auth.createToken(savedUser.id, savedUser.role, secret);
    }
}
