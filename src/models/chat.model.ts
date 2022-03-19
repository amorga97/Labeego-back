import * as mongoose from 'mongoose';

export const chatSchema = new mongoose.Schema({
    messages: [{ type: Object }],
    users: [{ type: Object }],
});

export interface ifMessage {
    date: string;
    text: string;
    sender: mongoose.Types.ObjectId;
    senderName: string;
}

export interface ifChatUser {
    name: string;
    id: mongoose.Types.ObjectId;
}

export interface ifChat {
    messages: ifMessage[];
    users: ifChatUser[];
}

export interface ifPartialChat {
    messages?: ifMessage[];
    users?: ifChatUser[];
}
