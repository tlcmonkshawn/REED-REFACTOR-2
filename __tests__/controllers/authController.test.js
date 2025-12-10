const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../models/db');
const authController = require('../../controllers/authController');

// Mock the database pool
jest.mock('../../models/db', () => ({
    query: jest.fn()
}));

describe('Auth Controller', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.post('/api/v1/auth/register', authController.register);
        app.post('/api/v1/auth/login', authController.login);
        
        // Reset mocks
        jest.clearAllMocks();
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                username: 'testuser',
                password: 'testpassword123',
                role: 'player'
            };

            // Mock: user doesn't exist
            pool.query.mockResolvedValueOnce({ rows: [] });
            
            // Mock: successful user creation
            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    username: 'testuser',
                    role: 'player',
                    created_at: new Date()
                }]
            });

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.msg).toBe('User registered successfully');
            expect(response.body.user.username).toBe('testuser');
            expect(response.body.user.role).toBe('player');
            expect(pool.query).toHaveBeenCalledTimes(2);
        });

        it('should return 400 if username already exists', async () => {
            const userData = {
                username: 'existinguser',
                password: 'testpassword123'
            };

            // Mock: user already exists
            pool.query.mockResolvedValueOnce({
                rows: [{ id: 1, username: 'existinguser' }]
            });

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body.msg).toBe('User already exists');
            expect(pool.query).toHaveBeenCalledTimes(1);
        });

        it('should return 400 if username or password is missing', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({ username: 'testuser' })
                .expect(400);

            expect(response.body.msg).toBe('Please enter all fields');
        });

        it('should default role to "player" if not provided', async () => {
            const userData = {
                username: 'testuser',
                password: 'testpassword123'
            };

            pool.query.mockResolvedValueOnce({ rows: [] });
            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    username: 'testuser',
                    role: 'player',
                    created_at: new Date()
                }]
            });

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.user.role).toBe('player');
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO users'),
                expect.arrayContaining(['testuser', expect.anything(), 'player'])
            );
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login successfully and return JWT token', async () => {
            const loginData = {
                username: 'testuser',
                password: 'testpassword123'
            };

            const hashedPassword = await bcrypt.hash('testpassword123', 10);
            
            // Mock: user exists
            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    username: 'testuser',
                    password: hashedPassword,
                    role: 'player'
                }]
            });

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData)
                .expect(200);

            expect(response.body.token).toBeDefined();
            expect(response.body.user.id).toBe(1);
            expect(response.body.user.username).toBe('testuser');
            expect(response.body.user.role).toBe('player');

            // Verify token is valid
            const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
            expect(decoded.user.id).toBe(1);
            expect(decoded.user.role).toBe('player');
        });

        it('should return 400 if username or password is missing', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ username: 'testuser' })
                .expect(400);

            expect(response.body.msg).toBe('Please provide username and password');
        });

        it('should return 400 if user does not exist', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'nonexistent',
                    password: 'password123'
                })
                .expect(400);

            expect(response.body.msg).toBe('Invalid credentials');
        });

        it('should return 400 if password is incorrect', async () => {
            const hashedPassword = await bcrypt.hash('correctpassword', 10);
            
            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    username: 'testuser',
                    password: hashedPassword,
                    role: 'player'
                }]
            });

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword'
                })
                .expect(400);

            expect(response.body.msg).toBe('Invalid credentials');
        });

        it('should return 500 if JWT_SECRET is not set', async () => {
            const originalSecret = process.env.JWT_SECRET;
            delete process.env.JWT_SECRET;

            const hashedPassword = await bcrypt.hash('testpassword123', 10);
            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    username: 'testuser',
                    password: hashedPassword,
                    role: 'player'
                }]
            });

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'testuser',
                    password: 'testpassword123'
                })
                .expect(500);

            expect(response.body.msg).toContain('JWT_SECRET not set');

            // Restore original secret
            process.env.JWT_SECRET = originalSecret;
        });
    });
});
