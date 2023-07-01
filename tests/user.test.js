import request from 'supertest';
import app from '../src/app.js';
import {describe, expect, test, beforeEach} from '@jest/globals';
import { User } from '../src/models/user.js';
import { setupDatabase, userOne, userOneId } from './fixtures/db.js'

beforeEach(setupDatabase);

describe('Test user functionality', () => {
    test('Should signup a new user', async () => {
        const response = await request(app)
            .post('/api/v1/users').send({
            name: "Mr Test Mihail",
            email: "mihail.test@gmail.com",
            password: 'testPass22222'
        }).expect(201);

        const user = await User.findById(response.body.user._id);
        expect(user).not.toBeNull();

        expect(response.body).toMatchObject({
            user: {
                name: "Mr Test Mihail",
                email: "mihail.test@gmail.com"
            },
            token: user.tokens[0].token
        });
    });

    test('Should login existing user', async () => {
        const response = await request(app)
        .post('/api/v1/users/login')
        .send
        ({
            email: userOne.email, 
            password: userOne.password
        })
        .expect(200);

        const user = await User.findById(userOneId);
        expect(user).not.toBeNull();
        expect(response.body.token).toBe(user.tokens[1].token);
    });

    test('Should not login user with bad creds', async () => {
        await request(app).post('/api/v1/users/login').send
        ({
            email: userOne.email, 
            password: 'test'
        }).expect(400);
    });

    test('Should get user profile', async () => {
        await request(app)
            .get('/api/v1/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);
    });

    test('Should not get user profile for unauthenticated user', async () => {
        await request(app)
            .get('/api/v1/users/me')
            .send()
            .expect(401);
    });

    test('Should delete account for user', async () => {
        const response = await request(app)
        .delete('/api/v1/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

        const user = await User.findById(userOneId);
        
        expect(user).toBeNull();
    });

    test('Should not delete account for unauthenticated user', async () => {
        await request(app)
        .delete('/api/v1/users/me')
        .send()
        .expect(401);
    });

    test('Should upload avatar image', async () => {
        await request(app)
            .post('/api/v1/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/user-avatar.png')
            expect(200);
        
        const user = await User.findById(userOneId);

        expect(user.avatar).toEqual(expect.any(Buffer));
    });

    test('Should update valid user fileds', async () => {
        await request(app)
            .patch('/api/v1/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                name: 'Mike Updated'
            })
            .expect(200)
        
        const user = await User.findById(userOneId);
        expect(user.name).toBe('Mike Updated');
    });

    test('Should update valid user fileds', async () => {
        await request(app)
            .patch('/api/v1/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                location: 'UK'
            })
            .expect(400)
        
        const user = await User.findById(userOneId);
        expect(user.location).toBe(undefined);
    });
});
