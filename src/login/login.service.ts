import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync } from 'bcryptjs';
import { Model } from 'mongoose';
import { ifUser } from 'src/models/user.model';

@Injectable()
export class LoginService {
    constructor(@InjectModel('User') private User: Model<ifUser>) {}

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
}
