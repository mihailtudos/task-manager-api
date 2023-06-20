import express from 'express';
import mongoose from './db/mongoose.mjs';
import usersRouter from './routers/user.js';
import tasksRouter from './routers/tasks.js';

const app = express();

const PORT = process.env.PORT;
console.log(PORT);

app.use(express.json());
app.use([tasksRouter, usersRouter]);
app.listen(PORT, () => {
    console.info('Server running on port ' + PORT);
});
