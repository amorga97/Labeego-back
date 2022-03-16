import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Headers,
    Logger,
} from '@nestjs/common';
import { UserCrudService } from './user.service';
import { CreateUserDto } from './dto/create-user-crud.dto';
import { UpdateUserDto } from './dto/update-user-crud.dto';
import { ifPartialUser } from '../models/user.model';

@Controller('users')
export class UserCrudController {
    constructor(private readonly userCrudService: UserCrudService) {}

    @Post('new')
    create(
        @Body() createUserDto: CreateUserDto,
        @Headers('authorization') token: string,
    ) {
        const logger = new Logger();
        logger.log(token);
        return this.userCrudService.create(createUserDto, token.substring(7));
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
    update(
        @Param('id') id: string,
        // @Body() updateUserCrudDto: UpdateUserCrudDto,
        @Body() body: ifPartialUser,
    ) {
        return this.userCrudService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userCrudService.remove(id);
    }
}
