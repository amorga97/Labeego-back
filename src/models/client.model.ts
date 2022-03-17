import * as mongoose from 'mongoose';

export const clientSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 15 },
    phone: [{ type: String, minlength: 9, maxlength: 9 }],
    address: {
        street: { type: String, required: true, minlength: 5 },
        number: { type: Number, required: true },
    },
    projects: [mongoose.SchemaTypes.ObjectId],
});

export interface ifClient {
    _id?: mongoose.Types.ObjectId;
    name: string;
    address: {
        street: string;
        number: number;
    };
    projects: mongoose.Types.ObjectId[];
}

export interface ifPartialClient {
    _id?: mongoose.Types.ObjectId;
    name?: string;
    address?: {
        street?: string;
        number?: number;
    };
    projects?: mongoose.Types.ObjectId[];
}
