const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('ADMIN_EMAIL or ADMIN_PASSWORD missing in .env');
            process.exit(1);
        }

        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin already exists. Updating password...');
            adminExists.password = adminPassword;
            adminExists.role = 'admin';
            await adminExists.save();
            console.log('Admin updated successfully.');
        } else {
            await User.create({
                name: 'Main Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
            });
            console.log('Admin created successfully.');
        }

        process.exit();
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
