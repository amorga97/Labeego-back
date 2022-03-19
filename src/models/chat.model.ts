import * as mongoose from 'mongoose';

export const chatSchema = new mongoose.Schema({
    messages: [{ type: Object }],
    users: [{ type: Object }],
    teamLeader: mongoose.SchemaTypes.ObjectId,
});

export interface ifMessage {
    date: string;
    text: string;
    sender: mongoose.Types.ObjectId;
}

export interface ifChatUser {
    name: string;
    id: mongoose.Types.ObjectId;
}

export interface ifChat {
    messages: ifMessage[];
    users: ifChatUser[];
    teamLeader: mongoose.Types.ObjectId;
}

export interface ifPartialChat {
    messages?: ifMessage[];
    users?: ifChatUser[];
    teamLeader?: mongoose.Types.ObjectId;
}
