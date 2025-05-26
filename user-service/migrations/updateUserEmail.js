const { connectDB, getDB } = require('../config/database');

async function updateUserEmail() {
    try {
        // Connect to MongoDB
        await connectDB();
        const db = getDB();
        const usersCollection = db.collection('users');

        // Check if any user has email field
        const hasEmailField = await usersCollection.findOne({ email: { $exists: true } });

        if (!hasEmailField) {
            // Add email field to all documents that don't have it
            await usersCollection.updateMany(
                { email: { $exists: false } },
                { $set: { email: null } }
            );
            console.log('Added email field to existing documents');
        }

        // Update documents with null or empty email
        await usersCollection.updateMany(
            { $or: [{ email: null }, { email: '' }] },
            [
                {
                    $set: {
                        email: { $concat: ["$username", "@temp.com"] }
                    }
                }
            ]
        );

        // Create a unique index on email field
        await usersCollection.createIndex({ email: 1 }, { unique: true });

        console.log('Successfully updated user email addresses and added unique index');
    } catch (error) {
        console.error('Error updating user email addresses:', error);
    }
}

updateUserEmail();