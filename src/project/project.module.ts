import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { projectSchema } from 'src/models/project.model';
import { AuthService } from 'src/utils/auth.service';
import { userSchema } from 'src/models/user.model';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
            { name: 'Project', schema: projectSchema },
            { name: 'User', schema: userSchema },
        ]),
    ],
    controllers: [ProjectController],
    providers: [ProjectService, AuthService],
})
export class ProjectModule {}
