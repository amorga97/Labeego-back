import * as mongoose from 'mongoose';

export const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 50 },
    description: { type: String, required: false },
    project: { type: mongoose.SchemaTypes.ObjectId, required: true },
    status: { type: String, required: true },
});

export interface ifTask {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    project: mongoose.Types.ObjectId;
    status: string;
}

export interface ifPartialTask {
    _id?: mongoose.Types.ObjectId;
    title?: string;
    description?: string;
    project?: mongoose.Types.ObjectId;
    status?: string;
}
