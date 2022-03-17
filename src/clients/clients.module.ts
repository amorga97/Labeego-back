import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { clientSchema } from '../models/client.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Client', schema: clientSchema }]),
    ],
    controllers: [ClientsController],
    providers: [ClientsService],
})
export class ClientsModule {}
