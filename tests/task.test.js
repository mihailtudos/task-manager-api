import request from 'supertest';
import app from '../src/app.js';
import {describe, expect, test, beforeEach} from '@jest/globals';
import { Task } from '../src/models/task.js';
import { setupDatabase, userOne, userOneId, taskOne, userTwo } from './fixtures/db.js'

beforeEach(setupDatabase);

describe('Taks functionality test suite', () => {
    test('Should create task', async () => {
        const response = await request(app)
            .post('/api/v1/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                description: 'Learn Heroku 2'
            })
            expect(201);
        
        const task = await Task.findById(response.body.task._id);
        expect(task).not.toBeNull();
        expect(task.completed).toEqual(false);
    });

    test('Should get user tasks', async () => {
        const response = await request(app)
            .get('/api/v1/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);

        const tasks = await Task.find({ owner: userOneId });
        expect(tasks.length).toBe(response.body.tasks.length);
    });

    test('Should not be allowed to delete task if not the owner', async () => {
        const response = await request(app)
            .delete(`/api/v1/tasks/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(404);
        
        const task = await Task.findById(taskOne._id);
        expect(task).not.toBeNull();
    });
})

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks