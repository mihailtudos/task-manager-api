import express from 'express';
import mongoose from './db/mongoose.mjs';
import usersRouter from './routers/user.js';
import tasksRouter from './routers/tasks.js';

const app = express();

app.use(express.json());
app.use([tasksRouter, usersRouter]);

export default app;