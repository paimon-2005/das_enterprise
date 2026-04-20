const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createDefaultAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI missing in .env');
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);
        
        const adminEmail = 'mriabhi2005@gmail.com';
        const adminPass = 'anu@2005';

        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('ℹ️ Admin already exists: mriabhi2005@gmail.com');
        } else {
            await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: adminPass,
                role: 'admin',
                isActive: true
            });
            console.log('✅ Admin created: mriabhi2005@gmail.com');
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
