import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync } from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ifUser } from '../models/user.model';
import { AuthService } from '../utils/auth.service';

@Injectable()
export class LoginService {
    constructor(
        @InjectModel('User') private User: Model<ifUser>,
        private readonly auth: AuthService,
    ) {}

    async login(nameToCheck: string, pwToCheck: string) {
        const savedUser = await this.User.findOne({ userName: nameToCheck });
        if (!savedUser) {
            throw new UnauthorizedException();
        } else if (compareSync(pwToCheck, (savedUser as ifUser).password)) {
            return savedUser;
        } else {
            throw new UnauthorizedException();
        }
    }

    async loginWithToken(token: string) {
        try {
            const tokenData = this.auth.validateToken(
                token.substring(7),
                process.env.SECRET,
            ) as JwtPayload;
            const savedUser = await this.User.findById(tokenData.id).populate(
                'team',
                { name: 1, _id: 1, userImage: 1 },
            );
            if (!savedUser) {
                throw new NotFoundException();
            }
            return savedUser;
        } catch (err) {
            throw new UnauthorizedException(err);
        }
    }
}
