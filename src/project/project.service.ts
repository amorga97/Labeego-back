import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Model, Types } from 'mongoose';
import { ifProject } from '../models/project.model';
import { ifUser } from '../models/user.model';
import { AuthService } from '../utils/auth.service';
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
            lastUpdate: new Date(),
            client: new Types.ObjectId(newProject.client),
            status: 'to do',
        });
    }

    findAll(token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        if (tokenData.admin) {
            return this.Project.find({
                teamLeader: tokenData.id,
            });
        }
        return this.Project.find({ user: tokenData.id });
    }

    async findOne(id: string, token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        if (tokenData.admin) {
            return await this.Project.findById(id).populate('tasks', {
                __v: 0,
            });
        }
        return await this.Project.findOne({
            _id: id,
            user: tokenData.id,
        }).populate('tasks', { __v: 0 });
    }

    async update(id: string, updatedProject: UpdateProjectDto, token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        if (tokenData.admin) {
            return this.Project.findOneAndUpdate(
                { _id: id, teamLeader: tokenData.id },
                { ...updatedProject, lastUpdate: new Date() },
                { new: true },
            );
        }
        return this.Project.findOneAndUpdate(
            { _id: id, user: tokenData.id },
            { ...updatedProject, lastUpdate: new Date() },
            { new: true },
        );
    }

    remove(id: string, token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        if (tokenData.admin) {
            return this.Project.findOneAndDelete({
                _id: id,
                teamLeader: tokenData.id,
            });
        }
        try {
            return this.Project.findOneAndDelete({
                _id: id,
                user: tokenData.id,
            });
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}
