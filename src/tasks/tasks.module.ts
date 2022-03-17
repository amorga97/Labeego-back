import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from '../models/task.model';
import { AuthService } from '../utils/auth.service';
import { projectSchema } from '../models/project.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Task', schema: taskSchema },
            { name: 'Project', schema: projectSchema },
        ]),
    ],
    controllers: [TasksController],
    providers: [TasksService, AuthService],
})
export class TasksModule {}
