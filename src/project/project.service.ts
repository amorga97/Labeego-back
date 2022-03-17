import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Model, Types } from 'mongoose';
import { ifClient } from 'src/models/client.model';
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
        @InjectModel('Client') private readonly Client: Model<ifClient>,
        private readonly auth: AuthService,
    ) {}

    async create(newProject: CreateProjectDto, token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        const UserData = await this.User.findById(tokenData.id);
        const savedProject = await this.Project.create({
            ...newProject,
            teamLeader: UserData.teamLeader,
            user: UserData._id,
            lastUpdate: new Date(),
            client: new Types.ObjectId(newProject.client),
            status: 'to do',
        });
        await this.User.findByIdAndUpdate(UserData._id, {
            $push: { projects: savedProject._id },
        });
        await this.Client.findByIdAndUpdate(savedProject.client, {
            $push: { projects: savedProject._id },
        });
        return savedProject;
    }

    async findAll(token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        if (tokenData.admin) {
            return await this.Project.find({
                teamLeader: tokenData.id,
            });
        }
        return await this.Project.find({ user: tokenData.id });
    }

    async findOne(id: string, token: string) {
        let projectToReturn: ifProject;
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        if (tokenData.admin) {
            projectToReturn = await this.Project.findOne({
                _id: id,
                teamLeader: tokenData.id,
            }).populate('tasks', {
                __v: 0,
            });
        }
        projectToReturn = await this.Project.findOne({
            _id: id,
            user: tokenData.id,
        }).populate('tasks', { __v: 0 });

        if (!projectToReturn) throw new NotFoundException();

        return projectToReturn;
    }

    async update(id: string, updatedProject: UpdateProjectDto, token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        try {
            if (tokenData.admin) {
                return await this.Project.findOneAndUpdate(
                    { _id: id, teamLeader: tokenData.id },
                    { ...updatedProject, lastUpdate: new Date() },
                    { new: true },
                );
            }
            return await this.Project.findOneAndUpdate(
                { _id: id, user: tokenData.id },
                { ...updatedProject, lastUpdate: new Date() },
                { new: true },
            );
        } catch (err) {
            throw new NotFoundException();
        }
    }

    async remove(id: string, token: string) {
        let deletedProject: ifProject;
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        if (tokenData.admin) {
            this.User.findByIdAndUpdate(tokenData.id, {
                $pull: { projects: id },
            });
            deletedProject = await this.Project.findOneAndDelete({
                _id: id,
                teamLeader: tokenData.id,
            });
        } else {
            this.User.findByIdAndUpdate(tokenData.id, {
                $pull: { projects: id },
            });
            deletedProject = await this.Project.findOneAndDelete({
                _id: id,
                user: tokenData.id,
            });
        }

        if (!deletedProject) throw new UnauthorizedException();

        return deletedProject;
    }
}
