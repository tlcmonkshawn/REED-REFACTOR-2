const request = require('supertest');
const express = require('express');
const healthController = require('../../controllers/healthController');

describe('Health Controller', () => {
    let app;
    let mockPool;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        
        // Mock pool with query method
        mockPool = {
            query: jest.fn()
        };
        
        // Set pool on app
        app.set('pool', mockPool);
        
        // Set up routes
        app.get('/', healthController.getRoot);
        app.get('/health', healthController.getHealth);
        app.get('/health.html', healthController.getHealthHtml);
        
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should return root health information', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);

            expect(response.body.message).toBe('REED REFACTOR 2 is running!');
            expect(response.body.database).toBe('PostgreSQL connected');
            expect(response.body).toHaveProperty('port');
            expect(response.body).toHaveProperty('environment');
        });

        it('should use default port 3000 if PORT not set', async () => {
            const originalPort = process.env.PORT;
            delete process.env.PORT;

            const response = await request(app)
                .get('/')
                .expect(200);

            expect(response.body.port).toBe(3000);

            if (originalPort) {
                process.env.PORT = originalPort;
            }
        });
    });

    describe('GET /health', () => {
        it('should return health status when database is connected', async () => {
            const mockTimestamp = new Date('2025-01-09T12:00:00Z');
            mockPool.query.mockImplementation((query, callback) => {
                callback(null, { rows: [{ now: mockTimestamp }] });
            });

            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body.status).toBe('ok');
            expect(response.body.database).toBe('connected');
            expect(response.body.timestamp).toBeDefined();
        });

        it('should return 500 if database connection fails', async () => {
            mockPool.query.mockImplementation((query, callback) => {
                callback(new Error('Connection failed'), null);
            });

            const response = await request(app)
                .get('/health')
                .expect(500);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Database connection failed');
        });
    });

    describe('GET /health.html', () => {
        it('should return HTML health dashboard', async () => {
            const mockDbCheck = {
                rows: [{
                    now: new Date('2025-01-09T12:00:00Z'),
                    version: 'PostgreSQL 15.0'
                }]
            };

            const mockItemCount = {
                rows: [{ count: '42' }]
            };

            const mockAuditStats = [
                { action: 'CREATE', count: 10, last_occurrence: new Date() },
                { action: 'UPDATE', count: 5, last_occurrence: new Date() }
            ];

            const mockRecentLogs = [
                {
                    created_at: new Date(),
                    action: 'CREATE',
                    table_name: 'booties',
                    record_id: 1,
                    request_method: 'POST',
                    request_path: '/api/v1/booties',
                    ip_address: '127.0.0.1'
                }
            ];

            // Mock pool.query calls
            mockPool.query
                .mockResolvedValueOnce(mockDbCheck)
                .mockResolvedValueOnce(mockItemCount);

            // Mock audit logger methods
            const mockAuditLogger = {
                getStats: jest.fn().mockResolvedValue(mockAuditStats),
                getRecentLogsFromDB: jest.fn().mockResolvedValue(mockRecentLogs)
            };

            app.set('auditLogger', mockAuditLogger);
            
            // Mock pool stats
            mockPool.totalCount = 10;
            mockPool.idleCount = 5;
            mockPool.waitingCount = 0;

            const response = await request(app)
                .get('/health.html')
                .expect(200);

            expect(response.text).toContain('Health & Audit Dashboard');
            expect(response.text).toContain('REED REFACTOR 2');
            expect(response.text).toContain('System Status');
            expect(response.text).toContain('Database Status');
        });

        it('should handle errors gracefully', async () => {
            mockPool.query.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .get('/health.html')
                .expect(500);

            expect(response.text).toContain('Error loading health page');
            expect(response.text).toContain('Database error');
        });
    });
});
