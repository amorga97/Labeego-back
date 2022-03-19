import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Headers,
} from '@nestjs/common';
import { UserCrudService } from './user.service';
import { CreateUserDto } from './dto/create-user-crud.dto';
import { UpdateUserDto } from './dto/update-user-crud.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userCrudService: UserCrudService) {}

    @Post('new')
    async create(
        @Body() createUserDto: CreateUserDto,
        @Headers('authorization') token: string,
    ) {
        return await this.userCrudService.create(
            createUserDto,
            token.substring(7),
        );
    }

    @Get()
    findAll() {
        return this.userCrudService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userCrudService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserCrudDto: UpdateUserDto) {
        return this.userCrudService.update(id, updateUserCrudDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Headers('Authorization') token: string) {
        return this.userCrudService.remove(id, token.substring(7));
    }
}
