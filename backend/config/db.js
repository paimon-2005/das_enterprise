const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google's public DNS (8.8.8.8) for SRV record resolution.
// The local ISP/network DNS does not support SRV lookups, which are required
// by the mongodb+srv:// connection string format used by MongoDB Atlas.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'foodco-db',
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
