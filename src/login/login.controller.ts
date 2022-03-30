import { Body, Controller, Post, Headers } from '@nestjs/common';
import { ifUser } from 'src/models/user.model';
import { AuthService } from '../utils/auth.service';
import { LoginService } from './login.service';

@Controller('/login')
export class LoginController {
    constructor(
        private readonly loginService: LoginService,
        private readonly Auth: AuthService,
    ) {}

    @Post()
    async login(
        @Body()
        body: { password?: string; userName?: string; hasToken: boolean },
        @Headers('Authorization') receivedToken: string,
    ) {
        const secret = process.env.SECRET;
        let savedUser: ifUser;
        let token: string;

        if (body.hasToken) {
            savedUser = await this.loginService.loginWithToken(receivedToken);
            token = this.Auth.createToken(
                savedUser._id.toString(),
                savedUser.admin,
                secret,
            );
            return {
                id: savedUser._id,
                name: savedUser.name,
                userName: savedUser.userName,
                teamLeader: savedUser.teamLeader,
                userImage: savedUser.userImage,
                mail: savedUser.mail,
                team: savedUser.team,
                admin: savedUser.admin,
                token,
            };
        }

        savedUser = await this.loginService.login(body.userName, body.password);
        token = this.Auth.createToken(
            savedUser._id.toString(),
            savedUser.admin,
            secret,
        );
        return {
            id: savedUser._id,
            name: savedUser.name,
            userName: savedUser.userName,
            teamLeader: savedUser.teamLeader,
            userImage: savedUser.userImage,
            mail: savedUser.mail,
            team: savedUser.team,
            admin: savedUser.admin,
            token,
        };
    }
}
