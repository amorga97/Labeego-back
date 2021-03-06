import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { clientSchema } from '../models/client.model';
import { userSchema } from 'src/models/user.model';
import { AuthService } from 'src/utils/auth.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Client', schema: clientSchema },
            { name: 'User', schema: userSchema },
        ]),
    ],
    controllers: [ClientsController],
    providers: [ClientsService, AuthService],
})
export class ClientsModule {}
