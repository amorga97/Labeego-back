import * as mongoose from 'mongoose';

// const isEmail = (email: string) => {
//     const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return regex.test(email);
// };

export const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        minlength: 3,
        maxlength: 15,
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 15,
    },
    teamLeader: { type: mongoose.SchemaTypes.ObjectId },
    userImage: { type: String, required: false },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    mail: {
        type: String,
        required: true,
        // validate: [isEmail, 'You did not enter a valid email adress'],
    },
    team: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
    projects: [mongoose.SchemaTypes.ObjectId],
});

export interface ifUser {
    _id?: mongoose.Types.ObjectId;
    teamLeader?: mongoose.Types.ObjectId;
    userName: string;
    password: string;
    name: string;
    userImage: string;
    admin?: boolean;
    team?: mongoose.Types.ObjectId[];
    mail: string;
    projects: mongoose.Types.ObjectId[];
}

export interface ifPartialUser {
    _id?: mongoose.Types.ObjectId;
    teamLeader?: mongoose.Types.ObjectId;
    userName?: string;
    password?: string;
    name?: string;
    userImage?: string;
    admin?: boolean;
    mail?: string;
    projects?: mongoose.Types.ObjectId[];
}
