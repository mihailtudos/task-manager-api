import express from 'express';
import { Task } from '../models/task.js';
import { auth } from '../middleware/auth.js';

const router = new express.Router();

router.post('/api/v1/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        const newTask = await task.save();
        return res.status(201).send({ task: newTask });
    } catch(err) {
        return res.status(400).send({error: err.message})
    }
});

router.get('/api/v1/tasks', auth, async (req, res) => {
    const match = {};
    const completed = req.query.completed;
    const limit = req.query.limit;
    const skip = req.query.skip;
    const sort = {};

    if (completed) {
        match.completed = completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        const task = await Task.find({ owner: req.user._id, ...match }).limit(Number(limit)).skip(Number(skip)).sort({ ...sort });
        return res.send({ task });
    } catch(err) {
        return res.status(400).send({error: err.message})
    }
});

router.get('/api/v1/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send({error: "Task not found."})
        }

        return res.send({ task });
    } catch(err) {
        return res.status(400).send({error: err.message})
    }
});

router.patch('/api/v1/tasks/:id', auth, async (req, res) => {
    if (!req.params.id || !req.body) {
        return res.status(500).send({error: "Invalid request"});
    }

    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid updates!"});
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        
        if (!task) {
            return res.status(404).send({error: 'Task not found'});
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        return res.send(task);
    } catch (error) {
        return res.status(400).send({error: error.message});
    }
});

router.delete('/api/v1/tasks/:id', auth, async (req, res) => {
    if (!req.params.id) {
        return res.status(500).send({error: "No id provided"});
    }

    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id });
        
        if (!task) {
            return res.status(404).send({error: "Task not found."})
        }

        return res.send({code: 200, task});
    } catch(err) {
        return res.status(400).send({error: err.message})
    }
});


export default router;