import { IsString, Length } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @Length(5, 50)
    title: string;
}
