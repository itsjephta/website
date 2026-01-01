const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
        console.warn('⚠️  MongoDB URI not found in environment variables');
        console.warn('   Add MONGODB_URI to your .env file to enable database features');
        return null;
    }

    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('✅ MongoDB already connected');
            return mongoose.connection;
        }

        const conn = await mongoose.connect(mongoURI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('   Server will continue without database connection');
        console.error('   Fix the connection string and restart the server');
        // Don't exit - allow server to run without DB for development
        return null;
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err.message);
});

mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});

module.exports = connectDB;

