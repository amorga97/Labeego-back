import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ifProject } from 'src/models/project.model';
import { ifTask } from '../models/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel('Task') private readonly Task: Model<ifTask>,
        @InjectModel('Project') private readonly Project: Model<ifProject>,
    ) {}

    async create(projectId: string, taskData: CreateTaskDto) {
        if (await this.Project.exists({ _id: projectId })) {
            const savedTask = await this.Task.create({
                ...taskData,
                project: projectId,
                status: 'to do',
            });
            await this.Project.findByIdAndUpdate(projectId, {
                $push: { tasks: savedTask._id },
            });
            return savedTask;
        }
        throw new NotFoundException();
    }

    async findAll(projectId: string) {
        if (await this.Project.exists({ _id: projectId })) {
            return this.Task.find({ project: projectId });
        }
        throw new NotFoundException();
    }

    async findOne(projectId: string, taskId: string) {
        if (
            (await this.Project.exists({ _id: projectId })) &&
            (await this.Task.exists({ _id: taskId }))
        ) {
            return await this.Task.findById(taskId);
        }
        throw new NotFoundException();
    }

    async update(
        projectId: string,
        taskId: string,
        updateTaskDto: UpdateTaskDto,
    ) {
        if (
            (await this.Project.exists({ _id: projectId })) &&
            (await this.Task.exists({ _id: taskId }))
        ) {
            return this.Task.findByIdAndUpdate(taskId, updateTaskDto, {
                new: true,
            });
        }
        throw new NotFoundException();
    }

    async remove(projectId: string, taskId: string) {
        if (
            (await this.Project.exists({ _id: projectId })) &&
            (await this.Task.exists({ _id: taskId }))
        ) {
            this.Project.findByIdAndUpdate(projectId, {
                $pull: {
                    tasks: taskId,
                },
            });
            return this.Task.findByIdAndDelete(taskId);
        }
        throw new NotFoundException();
    }
}
