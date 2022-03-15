import { Controller } from '@nestjs/common';
import { RegisterService } from './register.service';

@Controller()
export class RegisterController {
    constructor(private readonly RegisterServ: RegisterService) {}
}
