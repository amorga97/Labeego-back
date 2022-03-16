import * as mongoose from 'mongoose';

export const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 15,
    },
    ref: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 15,
    },
    teamLeader: { type: mongoose.SchemaTypes.ObjectId },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
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
    tasks: { type: Array },
});

export interface ifProject {
    _id?: mongoose.Types.ObjectId;
    title: string;
    ref: string;
    user: mongoose.Types.ObjectId;
    client: mongoose.Types.ObjectId;
    teamLeader: { type: mongoose.Types.ObjectId };
    status: string;
    appointment: Date;
    lastUpdate: Date;
    tasks: mongoose.Types.ObjectId[];
}

export interface ifPartialProject {
    _id?: mongoose.Types.ObjectId;
    title?: string;
    ref?: string;
    user?: mongoose.Types.ObjectId;
    client?: mongoose.Types.ObjectId;
    teamLeader?: { type: mongoose.Types.ObjectId };
    status?: string;
    appointment?: Date;
    lastUpdate?: Date;
    tasks?: mongoose.Types.ObjectId[];
}
