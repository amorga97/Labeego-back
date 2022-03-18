import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post(':projectId')
    create(
        @Param('projectId') projectId: string,
        @Body() createTaskDto: CreateTaskDto,
    ) {
        return this.tasksService.create(projectId, createTaskDto);
    }

    @Get(':projectId')
    findAll(@Param('projectId') projectId: string) {
        return this.tasksService.findAll(projectId);
    }

    @Get(':projectId/:taskId')
    findOne(
        @Param('projectId') projectId: string,
        @Param('taskId') taskId: string,
    ) {
        return this.tasksService.findOne(projectId, taskId);
    }

    @Patch(':projectId/:taskId')
    update(
        @Param('projectId') projectId: string,
        @Param('taskId') taskId: string,
        @Body() updateTaskDto: UpdateTaskDto,
    ) {
        return this.tasksService.update(projectId, taskId, updateTaskDto);
    }

    @Delete(':projectId/:taskId')
    remove(
        @Param('projectId') projectId: string,
        @Param('taskId') taskId: string,
    ) {
        return this.tasksService.remove(projectId, taskId);
    }
}
