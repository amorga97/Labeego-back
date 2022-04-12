import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ifClient } from 'src/models/client.model';
import { ifUser } from 'src/models/user.model';
import { AuthService } from 'src/utils/auth.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
    constructor(
        @InjectModel('Client') private readonly Client: Model<ifClient>,
        @InjectModel('User') private readonly User: Model<ifUser>,
        private readonly auth: AuthService,
    ) {}

    async create(clientData: CreateClientDto, token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        if (tokenData.admin) {
            return await this.Client.create({
                ...clientData,
                projects: [],
                teamLeader: tokenData.id,
            });
        } else {
            const user = await this.User.findById(tokenData.id);
            return await this.Client.create({
                ...clientData,
                projects: [],
                teamLeader: user.teamLeader,
            });
        }
    }

    async findAll(token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;

        if (tokenData.admin) {
            return await this.Client.find({ teamLeader: tokenData.id });
        } else {
            const user = await this.User.findById(tokenData.id);
            return await this.Client.find({ teamLeader: user.teamLeader });
        }
    }

    async findOne(id: string, token: string) {
        const tokenData = this.auth.validateToken(
            token.substring(7),
            process.env.SECRET,
        ) as JwtPayload;
        if (await this.Client.exists({ _id: id, teamLeader: tokenData.id })) {
            return await this.Client.findOne({
                _id: id,
                teamLeader: tokenData.id,
            });
        }
        throw new NotFoundException();
    }

    async update(id: string, newData: UpdateClientDto) {
        if (await this.Client.exists({ _id: id })) {
            return await this.Client.findByIdAndUpdate(id, newData, {
                new: true,
            });
        }
        throw new NotFoundException();
    }

    async remove(id: string) {
        if (await this.Client.exists({ _id: id })) {
            return await this.Client.findByIdAndDelete(id);
        }
        throw new NotFoundException();
    }
}
