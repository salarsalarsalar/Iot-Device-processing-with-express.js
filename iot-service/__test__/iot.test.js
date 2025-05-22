// __test__/iot.test.js
const request = require('supertest');
const express = require('express');
const iotRoutes = require('../routes/iotRoutes');

const app = express();
app.use(iotRoutes);

describe.skip('GET /api/iot/home', () => {
  it('should return IoT service welcome message', async () => {
    const res = await request(app).get('/api/iot/home');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Welcome to IoT Service' });
  });
});
