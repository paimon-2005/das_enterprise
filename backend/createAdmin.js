const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Force Node.js to use Google's public DNS (8.8.8.8) for SRV record resolution.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const User = require('./models/User');

dotenv.config();

const createDefaultAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI missing in .env');
            return;
        }

        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGO_URI, {
                dbName: 'foodco-db',
            });
        }
        
        const adminEmail = 'mriabhi2005@gmail.com';
        const adminPass = 'anu@2005';

        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log('ℹ️ Admin already exists: mriabhi2005@gmail.com');
        } else {
            admin = await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: adminPass,
                role: 'admin',
                isActive: true
            });
            console.log('✅ Admin created: mriabhi2005@gmail.com');
        }
        
        // Auto-seed Default Service Areas
        const Area = require('./models/Area');
        const defaultAreas = [
            { name: "Mogra", description: "Mogra local region", createdBy: admin._id },
            { name: "Jirat", description: "Jirat and surrounding zones", createdBy: admin._id },
            { name: "Kuntighat", description: "Kuntighat area", createdBy: admin._id }
        ];

        for (let areaData of defaultAreas) {
            const exists = await Area.findOne({ name: areaData.name });
            if (!exists) {
                await Area.create(areaData);
                console.log(`✅ Default Area added: ${areaData.name}`);
            }
        }

        // Only disconnect if running as a standalone script
        if (require.main === module) {
            await mongoose.disconnect();
            process.exit(0);
        }
    } catch (error) {
        console.error(`❌ Error seeding admin: ${error.message}`);
        if (require.main === module) process.exit(1);
    }
};

if (require.main === module) {
    createDefaultAdmin();
}

module.exports = createDefaultAdmin;
