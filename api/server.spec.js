const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig');

beforeEach(async () => {
    await db('users').truncate();
});

describe('server', () => {
    it('Testing enviornment', () => {
        expect(process.env.NODE_ENV).toBe('test');
    })
})

describe('POST /api/auth/register', () => {
    it('Reponds with 201', async done => {
        let res = await request(server)
            .post('/api/auth/register')
            .send({
                username: 'Tester',
                password: 'this is a test'
            })
        expect(res.status).toBe(201);
        done();
    })
    it('Length of users to be 1', async done => {
        let res = await request(server)
            .post('/api/auth/register')
            .send({
                username: 'Tester',
                password: 'this is a test'
            })
        expect(res.status).toBe(201);

        let inserted = await db('users').where({ username: 'Tester' });
        expect(inserted).toHaveLength(1);
        done();
    })
})

describe('POST /apu/auth/login', () => {
    it('Responds with 201', async done => {
        // Post user to db
        let res = await request(server)
            .post('/api/auth/register')
            .send({
                username: 'Tester',
                password: 'this is a test'
            })
        expect(res.status).toBe(201);

        // Login with same credentials
        res = await request(server)
            .post('/api/auth/login')
            .send({
                username: 'Tester',
                password: 'this is a test'
            })
        expect(res.status).toBe(201);
        done();
    })
    it('Responds with 404 when invalid credentials', async done => {
        // Post user to db
        let res = await request(server)
            .post('/api/auth/register')
            .send({
                username: 'Tester',
                password: 'this is a test'
            })
        expect(res.status).toBe(201);

        // Login with same credentials
        res = await request(server)
            .post('/api/auth/login')
            .send({
                username: 'Tester',
                password: 'bad password'
            })
        expect(res.status).toBe(404);
        done();
    })
})

describe('GET /api/jokes', () => {
    it('Responds with 400 if not authenticated', async done => {
        let res = await request(server)
        .get('/api/jokes')
        expect(res.status).toBe(400);
        done();
    })
    it('Message says <You shall not pass> if not authenticated', async done => {
        // Request jokes
        res = await request(server)
        .get('/api/jokes')
        expect(res.body.message).toBe('You shall not pass');
        done();
    })
})