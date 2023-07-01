
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../../src/models/user.js';
import { Task } from '../../src/models/task.js';

export const userOneId = new mongoose.Types.ObjectId();
export const userOne = {
    _id: userOneId,
    name: 'Mike Test',
    email: 'mike@gmail.com',
    password: '234waht!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

export const userTwoId = new mongoose.Types.ObjectId();
export const userTwo = {
    _id: userTwoId,
    name: 'Andrew Test ',
    email: 'andrew@gmail.com',
    password: '234waht!!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

export const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Learn Node.js',
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Learn testing',
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Learn Mongoose',
    owner: userTwoId
}


export const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}