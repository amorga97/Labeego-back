import { Test, TestingModule } from '@nestjs/testing';
import { UserCrudController } from './user.controller';
import { UserCrudService } from './user.service';

describe('UserCrudController', () => {
    let controller: UserCrudController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserCrudController],
            providers: [UserCrudService],
        }).compile();

        controller = module.get<UserCrudController>(UserCrudController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
