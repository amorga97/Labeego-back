import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Model, Types } from 'mongoose';
import { ifClient } from '../models/client.model';
import { ifTask } from '../models/task.model';
import { Helpers } from '../utils/helpers.service';
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
        @InjectModel('Task') private readonly Task: Model<ifTask>,
        private readonly auth: AuthService,
        private readonly helpers: Helpers,
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
            appointment: [],
            client: new Types.ObjectId(newProject.client),
            status: 'to do',
        });
        const initialTasks = await this.helpers.createInitialTasks(
            this.Task,
            savedProject._id.toString(),
        );
        const projectWithTasks = await this.Project.findByIdAndUpdate(
            savedProject._id,
            {
                toDo: [...initialTasks],
            },
            { new: true },
        )
            .populate('toDo', { __v: 0 })
            .populate('doing', { __v: 0 })
            .populate('toReview', { __v: 0 })
            .populate('done', { __v: 0 })
            .populate('user', {
                userImage: 1,
                name: 1,
            });
        await this.User.findByIdAndUpdate(UserData._id, {
            $push: { projects: savedProject._id },
        });
        await this.Client.findByIdAndUpdate(savedProject.client, {
            $push: { projects: savedProject._id },
        });
        return projectWithTasks;
    }

    async findAll(token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        if (tokenData.admin) {
            return await this.Project.find({
                teamLeader: tokenData.id,
            })
                .populate('toDo', { __v: 0 })
                .populate('doing', { __v: 0 })
                .populate('toReview', { __v: 0 })
                .populate('done', { __v: 0 })
                .populate('user', {
                    userImage: 1,
                    name: 1,
                });
        }
        return await this.Project.find({ user: tokenData.id })
            .populate('toDo', { __v: 0 })
            .populate('doing', { __v: 0 })
            .populate('toReview', { __v: 0 })
            .populate('done', { __v: 0 })
            .populate('user', {
                userImage: 1,
                name: 1,
            });
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
            })
                .populate('toDo', { __v: 0 })
                .populate('doing', { __v: 0 })
                .populate('toReview', { __v: 0 })
                .populate('done', { __v: 0 })
                .populate('user', { __v: 0 });
        } else {
            projectToReturn = await this.Project.findOne({
                _id: id,
                user: tokenData.id,
            })
                .populate('toDo', { __v: 0 })
                .populate('doing', { __v: 0 })
                .populate('toReview', { __v: 0 })
                .populate('done', { __v: 0 })
                .populate('user', { __v: 0 });
        }

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

    async removeAppointment(id: string, token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        try {
            if (tokenData.admin) {
                return await this.Project.findOneAndUpdate(
                    { _id: id, teamLeader: tokenData.id },
                    { $unset: { appointment: '' }, lastUpdate: new Date() },
                    { new: true },
                );
            }
            return await this.Project.findOneAndUpdate(
                { _id: id, user: tokenData.id },
                { $unset: { appointment: '' }, lastUpdate: new Date() },
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
            this.Task.deleteMany({ project: id });
            this.User.findByIdAndUpdate(tokenData.id, {
                $pull: { projects: id },
            });
            deletedProject = await this.Project.findOneAndDelete({
                _id: id,
                teamLeader: tokenData.id,
            });
        } else {
            this.Task.deleteMany({ project: id });
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
