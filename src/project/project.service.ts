import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    create(createProjectDto: CreateProjectDto, token: string) {
        return 'This action adds a new project';
    }

    findAll(token: string) {
        return `This action returns all project`;
    }

    findOne(id: string, token: string) {
        return `This action returns a #${id} project`;
    }

    update(id: string, updateProjectDto: UpdateProjectDto, token: string) {
        return `This action updates a #${id} project`;
    }

    remove(id: string, token: string) {
        return `This action removes a #${id} project`;
    }
}
