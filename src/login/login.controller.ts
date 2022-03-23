import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../utils/auth.service';
import { LoginService } from './login.service';

@Controller('/login')
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
        const token = this.Auth.createToken(
            savedUser.id,
            savedUser.admin,
            secret,
        );
        return {
            id: savedUser._id,
            name: savedUser.name,
            userName: savedUser.userName,
            teamLeader: savedUser.teamLeader,
            mail: savedUser.mail,
            admin: savedUser.admin,
            token,
        };
    }
}
