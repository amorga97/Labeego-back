import * as mongoose from 'mongoose';

export const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 20 },
    description: { type: String, required: false },
    project: { type: mongoose.SchemaTypes.ObjectId, required: true },
    status: { type: String, required: true },
});

export interface ifTask {
    title: string;
    description: string;
    project: mongoose.Types.ObjectId;
    status: string;
}
