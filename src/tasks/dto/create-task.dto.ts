import { IsObject, IsString, Length } from 'class-validator';
import mongoose from 'mongoose';

export class CreateTaskDto {
    @IsString()
    @Length(5, 50)
    title: string;

    @IsObject()
    project: mongoose.Types.ObjectId;
}
