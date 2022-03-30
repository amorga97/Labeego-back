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
            });
            switch (savedTask.status) {
                case 'to-do':
                    await this.Project.findByIdAndUpdate(projectId, {
                        $push: { toDo: savedTask._id },
                    });
                    break;
                case 'doing':
                    await this.Project.findByIdAndUpdate(projectId, {
                        $push: { doing: savedTask._id },
                    });
                    break;
                case 'to-review':
                    await this.Project.findByIdAndUpdate(projectId, {
                        $push: { toReview: savedTask._id },
                    });
                    break;
                case 'done':
                    await this.Project.findByIdAndUpdate(projectId, {
                        $push: { done: savedTask._id },
                    });
                    break;
            }
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
            const deletedTask = await this.Task.findByIdAndDelete(taskId);

            switch (deletedTask.status) {
                case 'to-do':
                    await this.Project.findByIdAndUpdate(projectId, {
                        $pull: { toDo: deletedTask._id },
                    });
                    break;
                case 'doing':
                    await this.Project.findByIdAndUpdate(projectId, {
                        $pull: { doing: deletedTask._id },
                    });
                    break;
                case 'to-review':
                    await this.Project.findByIdAndUpdate(projectId, {
                        $pull: { toReview: deletedTask._id },
                    });
                    break;
                case 'done':
                    await this.Project.findByIdAndUpdate(projectId, {
                        $pull: { done: deletedTask._id },
                    });
                    break;
            }

            return deletedTask;
        }
        throw new NotFoundException();
    }
}
