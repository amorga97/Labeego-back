import { Injectable } from '@nestjs/common';
import { CreateUserCrudDto } from './dto/create-user-crud.dto';
import { UpdateUserCrudDto } from './dto/update-user-crud.dto';

@Injectable()
export class UserCrudService {
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
