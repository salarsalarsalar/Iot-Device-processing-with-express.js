const sequelize = require('../config/database');

async function updateUserEmail() {
    try {
        // First, check if the email column exists
        const [results] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'email'
        `);

        if (results.length === 0) {
            // If email column doesn't exist, add it
            await sequelize.query(`
                ALTER TABLE users 
                ADD COLUMN email VARCHAR(255) NULL
            `);
        }

        // Update empty email addresses with a temporary value
        await sequelize.query(`
            UPDATE users 
            SET email = CONCAT(username, '@temp.com')
            WHERE email IS NULL OR email = ''
        `);

        // Then add the unique constraint
        await sequelize.query(`
            ALTER TABLE users 
            MODIFY COLUMN email VARCHAR(255) NOT NULL UNIQUE
        `);

        console.log('Successfully updated user email addresses and added unique constraint');
    } catch (error) {
        console.error('Error updating user email addresses:', error);
    } finally {
        await sequelize.close();
    }
}

updateUserEmail(); 