module.exports = {
    apps: [
      {
        name: 'user-service',
        script: './user-service/app.js',
        cwd: './user-service',
        instances: 1,
        autorestart: true,
        watch: true,
        env: {
          NODE_ENV: 'development'
        },
        env_production: {
          NODE_ENV: 'production'
        }
      },
      {
        name: 'iot-service',
        script: './iot-service/app.js',
        cwd: './iot-service',
        instances: 1,
        autorestart: true,
        watch: true,
        env: {
          NODE_ENV: 'development'
        },
        env_production: {
          NODE_ENV: 'production'
        }
      }
    ]
  }
  