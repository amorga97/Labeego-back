import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compareSync } from 'bcryptjs';
import { ifUser } from 'src/models/user.model';
import { CreateUserCrudDto } from './dto/create-user-crud.dto';
import { UpdateUserCrudDto } from './dto/update-user-crud.dto';

@Injectable()
export class UserCrudService {
    constructor(@InjectModel('User') private User: Model<ifUser>) {}

    create(createUserCrudDto: CreateUserCrudDto) {
        return 'This action adds a new userCrud';
    }

    findAll() {
        return `This action returns all userCrud`;
    }

    findOne(id: number) {
        return `This action returns a #${id} userCrud`;
    }

    update(id: number, updateUserCrudDto: UpdateUserCrudDto) {
        return `This action updates a #${id} userCrud`;
    }

    remove(id: number) {
        return `This action removes a #${id} userCrud`;
    }
}
