import mongoose from 'mongoose';
import validator from 'validator';

const taskScheme = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

export const Task = mongoose.model('Task', taskScheme);