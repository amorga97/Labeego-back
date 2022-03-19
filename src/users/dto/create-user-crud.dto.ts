import { IsString, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(3, 20)
    userName: string;

    @IsString()
    @Length(3, 20)
    name: string;

    @IsString()
    @Length(8, 25)
    password: string;

    @IsEmail()
    mail: string;
}
