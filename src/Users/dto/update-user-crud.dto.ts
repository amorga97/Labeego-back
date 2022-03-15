import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCrudDto } from './create-user-crud.dto';

export class UpdateUserCrudDto extends PartialType(CreateUserCrudDto) {}
