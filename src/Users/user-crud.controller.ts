import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserCrudService } from './user-crud.service';
import { CreateUserCrudDto } from './dto/create-user-crud.dto';
import { UpdateUserCrudDto } from './dto/update-user-crud.dto';

@Controller('user-crud')
export class UserCrudController {
  constructor(private readonly userCrudService: UserCrudService) {}

  @Post()
  create(@Body() createUserCrudDto: CreateUserCrudDto) {
    return this.userCrudService.create(createUserCrudDto);
  }

  @Get()
  findAll() {
    return this.userCrudService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCrudService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserCrudDto: UpdateUserCrudDto) {
    return this.userCrudService.update(+id, updateUserCrudDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCrudService.remove(+id);
  }
}
