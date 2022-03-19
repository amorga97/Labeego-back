import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ifUser } from 'src/models/user.model';

@Injectable()
export class RegisterService {
    constructor(@InjectModel('User') private User: Model<ifUser>) {}
    async registerUser(userToAdd: ifUser) {
        const savedUser = await this.User.create({
            ...userToAdd,
            admin: true,
            team: [],
        });
        return this.User.findByIdAndUpdate(
            savedUser._id,
            {
                teamLeader: savedUser._id,
                $push: {
                    team: savedUser._id.toString(),
                },
            },
            { new: true },
        );
    }
}
