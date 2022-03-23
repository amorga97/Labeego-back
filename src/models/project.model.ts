import * as mongoose from 'mongoose';

export const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 50,
    },
    description: {
        type: String,
        minlength: 20,
        maxlength: 300,
        required: true,
    },
    teamLeader: { type: mongoose.SchemaTypes.ObjectId },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User',
    },
    client: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    appointment: { type: Date, required: false },
    lastUpdate: { type: Date, required: false },
    toDo: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Task' }],
    doing: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Task' }],
    toReview: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Task' }],
    done: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Task' }],
});

export interface ifProject {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    user: mongoose.Types.ObjectId;
    client: mongoose.Types.ObjectId;
    teamLeader: { type: mongoose.Types.ObjectId };
    status: string;
    appointment: Date;
    lastUpdate: Date;
    toDo: mongoose.Types.ObjectId;
    doing: mongoose.Types.ObjectId;
    toReview: mongoose.Types.ObjectId;
    done: mongoose.Types.ObjectId;
}

export interface ifPartialProject {
    _id?: mongoose.Types.ObjectId;
    title?: string;
    description?: string;
    user?: mongoose.Types.ObjectId;
    client?: mongoose.Types.ObjectId;
    teamLeader?: { type: mongoose.Types.ObjectId };
    status?: string;
    appointment?: Date;
    lastUpdate?: Date;
    toDo?: mongoose.Types.ObjectId;
    doing?: mongoose.Types.ObjectId;
    toReview?: mongoose.Types.ObjectId;
    done?: mongoose.Types.ObjectId;
}
