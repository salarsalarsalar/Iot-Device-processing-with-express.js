const request = require('supertest');
const app = require('../app');

process.env.USER_SERVICE_PORT = 3001;
process.env.IOT_SERVICE_PORT = 3002;

describe('GET /api/welcome', () => {
  it('should return welcome message with service URLs', async () => {
    const res = await request(app).get('/api/welcome');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Welcome to the API Gateway');
    expect(res.body.services).toEqual([
      { name: 'IoT Service', url: `https://localhost:${process.env.IOT_SERVICE_PORT}` },
      { name: 'User Service', url: `https://localhost:${process.env.USER_SERVICE_PORT}` },
    ]);
  });
});
