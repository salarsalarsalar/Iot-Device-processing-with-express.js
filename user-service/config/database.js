const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const sharedEnv = dotenv.config({ path: '../.env' });
dotenvExpand.expand(sharedEnv);
dotenv.config();

const client = new MongoClient('mongodb://mongo:27017/user_db', {
    maxPoolSize: 5,
    minPoolSize: 0,
    connectTimeoutMS: 30000,
});

let db;
async function connectDB() {
    try {
        await client.connect();
        db = client.db('user_db');
        console.log('User Database connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the User database:', err);
        process.exit(1);
    }
};

function getDB() {
    if (!db) throw new Error('DB not initialized');
    return db;
};

module.exports = { connectDB, getDB };