import { IsObject, IsString, Length } from 'class-validator';
import mongoose from 'mongoose';

export class CreateProjectDto {
    @IsString()
    @Length(5, 50)
    title: string;

    @IsString()
    @Length(20, 300)
    description: string;

    @IsObject()
    client: mongoose.Types.ObjectId;
}
