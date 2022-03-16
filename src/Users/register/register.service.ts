import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ifUser } from 'src/models/user.model';

@Injectable()
export class RegisterService {
    constructor(@InjectModel('User') private User: Model<ifUser>) {}
    registerUser(userToAdd: ifUser) {
        return this.User.create(userToAdd);
    }
}
