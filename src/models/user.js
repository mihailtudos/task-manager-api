import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Task } from './task.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email must be correctly formated.")
            }
        },
        trim: true,
        lowercase: true
    },
    age: {
        default: 0,
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minLength: 7,
        required: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password cannot contain 'password'.")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        } 
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true,
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.tokens;
    delete userObject.password;
    delete userObject.avatar;

    return userObject;
}

userSchema.statics.findByCreadentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

// Hash pw when saved
userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Delete user tasks on user deletion
userSchema.pre('deleteOne', async function(next) {
    const user = this;
    
    await Task.deleteMany({ owner: user._id });
    next();
});

export const User = mongoose.model('User', userSchema);
