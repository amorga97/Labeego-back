import {
    IsArray,
    IsDate,
    IsObject,
    IsString,
    Length,
    Matches,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateProjectDto {
    @IsString()
    @Length(5, 50)
    title: string;

    @IsObject()
    user: mongoose.Types.ObjectId;

    @IsObject()
    client: mongoose.Types.ObjectId;

    @IsObject()
    teamLeader: mongoose.Types.ObjectId;

    @IsString()
    @Matches('to do')
    @Matches('to review')
    @Matches('doing')
    @Matches('done')
    status: string;

    @IsDate()
    appointment: Date;

    @IsDate()
    lastUpdate: Date;

    @IsArray()
    tasks: mongoose.Types.ObjectId[];
}
