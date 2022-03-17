import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { projectSchema } from '../models/project.model';
import { AuthService } from '../utils/auth.service';
import { userSchema } from '../models/user.model';
import { clientSchema } from '../models/client.model';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
            { name: 'Project', schema: projectSchema },
            { name: 'User', schema: userSchema },
            { name: 'Client', schema: clientSchema },
        ]),
    ],
    controllers: [ProjectController],
    providers: [ProjectService, AuthService],
})
export class ProjectModule {}
