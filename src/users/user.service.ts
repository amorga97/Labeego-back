import {
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ifPartialUser, ifUser } from '../models/user.model';
import { AuthService } from '../utils/auth.service';
import { CreateUserDto } from './dto/create-user-crud.dto';
import { Helpers } from '../utils/helpers.service';
import { ifChat } from '../models/chat.model';

@Injectable()
export class UserCrudService {
    constructor(
        @InjectModel('User') private readonly User: Model<ifUser>,
        @InjectModel('Chat') private readonly Chat: Model<ifChat>,
        private readonly auth: AuthService,
        private readonly helpers: Helpers,
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
            const updatedAdmin = await this.User.findByIdAndUpdate(
                adminData.id,
                {
                    $push: { team: savedUser._id },
                },
                { new: true },
            ).populate('team', {
                teamLeader: 0,
                userName: 0,
                password: 0,
                userImage: 0,
                admin: 0,
                team: 0,
                mail: 0,
                projects: 0,
            });
            const teamChats = await this.helpers.createTeamChats(
                this.Chat,
                updatedAdmin.team,
            );
            const logger = new Logger();
            logger.log(teamChats);
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
        const response = await this.User.findByIdAndUpdate(id, body, {
            new: true,
        });
        if (!response) throw new NotFoundException();
        return response;
    }

    async remove(id: string, token: string) {
        const adminData = this.auth.validateToken(
            token,
            process.env.SECRET,
        ) as JwtPayload;
        const deletedUser = await this.User.findByIdAndDelete(id);
        if (adminData.admin) {
            this.User.findByIdAndUpdate(adminData.id, {
                $pull: [{ _id: deletedUser._id }],
            });
        }
        return deletedUser;
    }
}
