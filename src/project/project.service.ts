import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ifProject } from 'src/models/project.model';
import { ifUser } from 'src/models/user.model';
import { AuthService } from 'src/utils/auth.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel('Project') private readonly Project: Model<ifProject>,
        @InjectModel('User') private readonly User: Model<ifUser>,
        private readonly auth: AuthService,
    ) {}

    async create(newProject: CreateProjectDto, token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        const UserData = await this.User.findById(tokenData.id);
        return await this.Project.create({
            ...newProject,
            teamLeader: UserData.teamLeader,
            user: UserData._id,
        });
    }

    findAll(token: string) {
        return `This action returns all project`;
    }

    async findOne(id: string, token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        return await this.Project.findOne({
            _id: id,
            user: tokenData.id,
        }).populate('tasks', { __v: 0 });
    }

    update(id: string, updateProjectDto: UpdateProjectDto, token: string) {
        return `This action updates a #${id} project`;
    }

    remove(id: string, token: string) {
        return `This action removes a #${id} project`;
    }
}
