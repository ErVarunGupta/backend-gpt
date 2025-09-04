import mongoose from "mongoose";

const {Schema} = mongoose;

const MessageSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        default: 'user',
        required: true
    },
    content:{
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const ThreadSchema = new Schema({
    threadId: {
        type: String,
        required: true,
        unique: true
    },
    title:{
        type: String,
        required: true
    },
    messages: [MessageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
})

const Thread = mongoose.model('Thread', ThreadSchema);
export default Thread;