import { Helpers } from './helpers.service';

describe('Given the service Helpers', () => {
    const mockModel: any = {
        insertMany: jest.fn(),
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
});
