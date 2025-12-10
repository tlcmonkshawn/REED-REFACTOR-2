const request = require('supertest');
const express = require('express');
const pool = require('../../models/db');
const bootiesController = require('../../controllers/bootiesController');
const authMiddleware = require('../../middleware/auth');

// Mock the database pool
jest.mock('../../models/db', () => ({
    query: jest.fn()
}));

// Mock JWT verification for auth middleware
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn((token, secret) => {
        if (token === 'valid-token') {
            return { user: { id: 1, role: 'player' } };
        }
        throw new Error('Invalid token');
    })
}));

describe('Booties Controller', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        
        // Apply auth middleware to protected routes
        app.post('/api/v1/booties', authMiddleware, bootiesController.createBootie);
        app.get('/api/v1/booties', bootiesController.getAllBooties);
        app.get('/api/v1/booties/:id', bootiesController.getBootieById);
        app.put('/api/v1/booties/:id', authMiddleware, bootiesController.updateBootie);
        app.delete('/api/v1/booties/:id', authMiddleware, bootiesController.deleteBootie);
        
        // Reset mocks
        jest.clearAllMocks();
    });

    describe('POST /api/v1/booties', () => {
        it('should create a new bootie successfully', async () => {
            const bootieData = {
                title: 'Test Bootie',
                description: 'A test bootie description',
                status: 'unlisted',
                category: 'Electronics',
                location_id: 1
            };

            // Mock successful creation
            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    title: 'Test Bootie',
                    description: 'A test bootie description',
                    status: 'unlisted',
                    category: 'Electronics',
                    location_id: 1,
                    user_id: 1,
                    created_at: new Date()
                }]
            });

            const response = await request(app)
                .post('/api/v1/booties')
                .set('x-auth-token', 'valid-token')
                .send(bootieData)
                .expect(201);

            expect(response.body.title).toBe('Test Bootie');
            expect(response.body.user_id).toBe(1);
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO booties'),
                expect.arrayContaining(['Test Bootie', 'A test bootie description', 'unlisted', 'Electronics', 1, 1])
            );
        });

        it('should default status to "unlisted" if not provided', async () => {
            const bootieData = {
                title: 'Test Bootie',
                description: 'Description',
                category: 'Electronics',
                location_id: 1
            };

            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    title: 'Test Bootie',
                    status: 'unlisted',
                    user_id: 1
                }]
            });

            await request(app)
                .post('/api/v1/booties')
                .set('x-auth-token', 'valid-token')
                .send(bootieData)
                .expect(201);

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO booties'),
                expect.arrayContaining(['Test Bootie', 'Description', 'unlisted', 'Electronics', 1, 1])
            );
        });

        it('should return 401 if no auth token provided', async () => {
            const response = await request(app)
                .post('/api/v1/booties')
                .send({ title: 'Test' })
                .expect(401);

            expect(response.body.msg).toBe('No token, authorization denied');
        });
    });

    describe('GET /api/v1/booties', () => {
        it('should get all booties', async () => {
            const mockBooties = [
                { id: 1, title: 'Bootie 1', status: 'unlisted' },
                { id: 2, title: 'Bootie 2', status: 'listed' }
            ];

            pool.query.mockResolvedValueOnce({ rows: mockBooties });

            const response = await request(app)
                .get('/api/v1/booties')
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0].title).toBe('Bootie 1');
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM booties ORDER BY created_at DESC')
            );
        });

        it('should return empty array if no booties exist', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app)
                .get('/api/v1/booties')
                .expect(200);

            expect(response.body).toEqual([]);
        });
    });

    describe('GET /api/v1/booties/:id', () => {
        it('should get a bootie by id', async () => {
            const mockBootie = {
                id: 1,
                title: 'Test Bootie',
                description: 'Description',
                status: 'unlisted'
            };

            pool.query.mockResolvedValueOnce({ rows: [mockBootie] });

            const response = await request(app)
                .get('/api/v1/booties/1')
                .expect(200);

            expect(response.body.id).toBe(1);
            expect(response.body.title).toBe('Test Bootie');
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM booties WHERE id'),
                ['1']  // Express route params are strings
            );
        });

        it('should return 404 if bootie not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app)
                .get('/api/v1/booties/999')
                .expect(404);

            expect(response.body.msg).toBe('Bootie not found');
        });
    });

    describe('PUT /api/v1/booties/:id', () => {
        it('should update a bootie successfully', async () => {
            const existingBootie = {
                id: 1,
                title: 'Old Title',
                user_id: 1,
                status: 'unlisted'
            };

            const updateData = {
                title: 'New Title',
                description: 'New Description',
                status: 'listed',
                category: 'Electronics',
                location_id: 2
            };

            // Mock: bootie exists and belongs to user
            pool.query.mockResolvedValueOnce({ rows: [existingBootie] });
            // Mock: successful update
            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    ...updateData,
                    user_id: 1,
                    updated_at: new Date()
                }]
            });

            const response = await request(app)
                .put('/api/v1/booties/1')
                .set('x-auth-token', 'valid-token')
                .send(updateData)
                .expect(200);

            expect(response.body.title).toBe('New Title');
            expect(response.body.status).toBe('listed');
        });

        it('should return 404 if bootie not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app)
                .put('/api/v1/booties/999')
                .set('x-auth-token', 'valid-token')
                .send({ title: 'New Title' })
                .expect(404);

            expect(response.body.msg).toBe('Bootie not found');
        });

        it('should return 401 if user does not own bootie and is not agent/boss', async () => {
            const existingBootie = {
                id: 1,
                title: 'Other User Bootie',
                user_id: 2  // Different user
            };

            pool.query.mockResolvedValueOnce({ rows: [existingBootie] });

            const response = await request(app)
                .put('/api/v1/booties/1')
                .set('x-auth-token', 'valid-token')
                .send({ title: 'New Title' })
                .expect(401);

            expect(response.body.msg).toBe('User not authorized');
        });
    });

    describe('DELETE /api/v1/booties/:id', () => {
        it('should delete a bootie successfully', async () => {
            const existingBootie = {
                id: 1,
                title: 'Test Bootie',
                user_id: 1
            };

            pool.query.mockResolvedValueOnce({ rows: [existingBootie] });
            pool.query.mockResolvedValueOnce({ rowCount: 1 });

            const response = await request(app)
                .delete('/api/v1/booties/1')
                .set('x-auth-token', 'valid-token')
                .expect(200);

            expect(response.body.msg).toBe('Bootie removed');
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM booties'),
                ['1']  // Express route params are strings
            );
        });

        it('should return 404 if bootie not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app)
                .delete('/api/v1/booties/999')
                .set('x-auth-token', 'valid-token')
                .expect(404);

            expect(response.body.msg).toBe('Bootie not found');
        });

        it('should return 401 if user does not own bootie and is not bootie_boss', async () => {
            const existingBootie = {
                id: 1,
                title: 'Other User Bootie',
                user_id: 2
            };

            pool.query.mockResolvedValueOnce({ rows: [existingBootie] });

            const response = await request(app)
                .delete('/api/v1/booties/1')
                .set('x-auth-token', 'valid-token')
                .send({ title: 'New Title' })
                .expect(401);

            expect(response.body.msg).toBe('User not authorized');
        });
    });
});
