import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ifClient } from 'src/models/client.model';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
    constructor(
        @InjectModel('Client') private readonly Client: Model<ifClient>,
    ) {}

    async create(clientData: CreateClientDto) {
        return await this.Client.create(clientData);
    }

    async findAll() {
        return await this.Client.find({});
    }

    async findOne(id: string) {
        return await this.Client.findById(id);
    }

    async update(id: string, newData: UpdateClientDto) {
        return await this.Client.findByIdAndUpdate(id, newData, { new: true });
    }

    async remove(id: string) {
        return await this.Client.findByIdAndDelete(id);
    }
}
