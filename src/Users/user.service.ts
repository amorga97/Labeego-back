import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ifPartialUser, ifUser } from 'src/models/user.model';
import { AuthService } from '../utils/auth.service';
import { CreateUserDto } from './dto/create-user-crud.dto';
import { UpdateUserDto } from './dto/update-user-crud.dto';

@Injectable()
export class UserCrudService {
    constructor(
        @InjectModel('User') private readonly User: Model<ifUser>,
        private readonly auth: AuthService,
    ) {}

    async create(createUserDto: CreateUserDto, token: string) {
        const adminData = this.auth.validateToken(
            token,
            process.env.SECRET,
        ) as JwtPayload;
        if (adminData.admin) {
            const savedUser = await this.User.create({
                ...createUserDto,
                teamLeader: new Types.ObjectId(adminData.id),
                password: bcrypt.hashSync(createUserDto.password),
                admin: false,
                projects: [],
            });
            await this.User.findByIdAndUpdate(adminData.id, {
                $push: { team: savedUser._id },
            });
            return savedUser;
        }
        throw new UnauthorizedException();
    }

    async findAll() {
        return await this.User.find({});
    }

    async findOne(id: string) {
        return await this.User.findById(id)
            .populate('projects')
            .populate('team', { password: 0 });
    }

    async update(id: string, body: ifPartialUser) {
        return await this.User.findByIdAndUpdate(id, body, { new: true });
    }

    async remove(id: string) {
        return await this.User.findByIdAndDelete(id);
    }
}
