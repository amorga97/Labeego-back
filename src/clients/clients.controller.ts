import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Headers,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post('new')
    create(
        @Body() createClientDto: CreateClientDto,
        @Headers('Authorization') token: string,
    ) {
        return this.clientsService.create(createClientDto, token);
    }

    @Get()
    findAll(@Headers('Authorization') token: string) {
        return this.clientsService.findAll(token);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Headers('Authorization') token: string) {
        return this.clientsService.findOne(id, token);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
        return this.clientsService.update(id, updateClientDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.clientsService.remove(id);
    }
}
