const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const sharedEnv = dotenv.config({ path: '../.env' });
dotenvExpand.expand(sharedEnv); // Expand shared variables
dotenv.config(); // Load .env variables

const sequelize = new Sequelize(
    process.env.IOT_DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);
// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('IoT Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the IoT database:', err);
    });

module.exports = sequelize; 