import { Helpers } from './helpers.service';
import { Types } from 'mongoose';

describe('Given the service Helpers', () => {
    const mockModel: any = {
        insertMany: jest.fn(),
        create: jest.fn(),
    };
    describe('When calling Helpers.createInitialTasks', () => {
        test('Then it should return an array of ids', async () => {
            mockModel.insertMany.mockResolvedValue({
                insertedCount: 2,
                insertedIds: ['id1', 'id2'],
            });
            const result = await Helpers.prototype.createInitialTasks(
                mockModel,
                'id',
            );
            expect(result).toHaveLength(2);
        });
    });

    describe('When calling Helpers.createInitialTasks', () => {
        test('Then it should return an array of ids', async () => {
            mockModel.create.mockResolvedValue({ _id: 'id' });
            const result = await Helpers.prototype.createTeamChats(
                mockModel,
                [
                    { _id: new Types.ObjectId('6236033b7db8d6f41bd6463f') },
                    { _id: new Types.ObjectId('6236033b7db8d6f41bd6463f') },
                ],
                new Types.ObjectId('6236033b7db8d6f41bd6463f'),
            );
            expect(result).toHaveProperty('length');
        });
    });
});
