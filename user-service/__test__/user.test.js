const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');

const app = express();
app.use(userRoutes);

describe('GET /api/user/home', () => {
  it('should return User service welcome message', async () => {
    const res = await request(app).get('/api/user/home');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: 'Welcome to User Service'
    });
  });
});
