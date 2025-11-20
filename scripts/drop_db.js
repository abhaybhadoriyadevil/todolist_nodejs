const mongoose = require('mongoose');
require('dotenv').config();

const dropDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        console.log('⚠️  Dropping database...');
        await mongoose.connection.dropDatabase();
        console.log('✅ Database dropped successfully');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error dropping database:', error);
        process.exit(1);
    }
};

dropDatabase();
