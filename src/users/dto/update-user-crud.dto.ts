import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user-crud.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
