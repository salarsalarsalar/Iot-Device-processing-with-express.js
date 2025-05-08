module.exports = {
    apps: [
      {
        name: 'flask-app',
        script: 'python', // Start the Flask app with Python
        args: 'run.py', // Specify the script to run
        cwd: './data-processing-service', // The directory where your Flask app is located
        env: {
          FLASK_APP: 'run.py',
          FLASK_ENV: 'development',
          // Add any other environment variables you may need
        },
        watch: true, // Optional: restart the app if files change (useful for development)
        instances: 1, // You can increase this if you want to run multiple instances
         // instances: 'max',  // Spawn as many instances as CPU cores
        exec_mode: 'cluster',  
      },
      {
        name: 'api-gateway',
        script: './api-gateway/app.js',
        cwd: './api-gateway',
        instances: 1,
         // instances: 'max',  // Spawn as many instances as CPU cores
        autorestart: true,
        watch: true,
        env_development: {NODE_ENV: 'development'},
        env_staging: {NODE_ENV: 'staging'},
        env_production: {NODE_ENV: 'production'}, 
      },
      {
        name: 'api-gateway-cron',
        script: './api-gateway/utils/cronLogger.js',
        cwd: './api-gateway',
        instances: 1,
        autorestart: true,
        watch: false,
        env_development: { NODE_ENV: 'development' },
        env_staging: { NODE_ENV: 'staging' },
        env_production: { NODE_ENV: 'production' },
      },

      {
        name: 'user-service',
        script: './user-service/app.js',
        cwd: './user-service',
        instances: 1,
         // instances: 'max',  // Spawn as many instances as CPU cores
        autorestart: true,
        watch: true,
        env_development: {NODE_ENV: 'development'},
        env_staging: {NODE_ENV: 'staging'},
        env_production: {NODE_ENV: 'production'},
      },
      {
        name: 'user-service-cron',
        script: './user-service/utils/cronLogger.js',
        cwd: './user-service',
        instances: 1,
        autorestart: true,
        watch: false,
        env_development: { NODE_ENV: 'development' },
        env_staging: { NODE_ENV: 'staging' },
        env_production: { NODE_ENV: 'production' }
        
      },
      {
        name: 'iot-service',
        script: './iot-service/app.js',
        cwd: './iot-service',
        instances: 1,
         // instances: 'max',  // Spawn as many instances as CPU cores
        autorestart: true,
        watch: true,
        env_development: {NODE_ENV: 'development'},
        env_staging: {NODE_ENV: 'staging'},
        env_production: {NODE_ENV: 'production'}
      },
      {
        name: 'iot-service-cron',
        script: './iot-service/utils/cronLogger.js',
        cwd: './iot-service',
        instances: 1,
        autorestart: true,
        watch: false,
        env_development: { NODE_ENV: 'development' },
        env_staging: { NODE_ENV: 'staging' },
        env_production: { NODE_ENV: 'production' }
      }
    ]
  }
  