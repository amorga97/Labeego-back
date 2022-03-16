import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { projectSchema } from 'src/models/project.model';
import { AuthService } from 'src/utils/auth.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: 'Project', schema: projectSchema }]),
    ],
    controllers: [ProjectController],
    providers: [ProjectService, AuthService],
})
export class ProjectModule {}
