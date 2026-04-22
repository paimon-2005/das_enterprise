const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Area = require('./models/Area');

dotenv.config();

const seedAreas = async () => {
    try {
        const directUri = "mongodb://mriabhi2005_db_user:dVtn6H1KodiEPPS1@cluster0-shard-00-00.8da0fma.mongodb.net:27017,cluster0-shard-00-01.8da0fma.mongodb.net:27017,cluster0-shard-00-02.8da0fma.mongodb.net:27017/foodco-db?ssl=true&replicaSet=atlas-2y4s3p-shard-0&authSource=admin&retryWrites=true&w=majority";
        await mongoose.connect(directUri);
        
        const adminEmail = 'mriabhi2005@gmail.com';
        const admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            console.error('❌ Admin not found. Cannot seed areas without an admin.');
            return;
        }

        const areasToSeed = [
            { name: 'Mogra', description: 'Mogra local region', createdBy: admin._id },
            { name: 'Jirat', description: 'Jirat and surrounding zones', createdBy: admin._id },
            { name: 'Kuntighat', description: 'Kuntighat area', createdBy: admin._id }
        ];

        for (const areaData of areasToSeed) {
            const exists = await Area.findOne({ name: areaData.name });
            if (!exists) {
                await Area.create(areaData);
                console.log(`✅ Area created: ${areaData.name}`);
            } else {
                console.log(`ℹ️ Area already exists: ${areaData.name}`);
            }
        }

        console.log('🎉 Area seeding complete!');
        process.exit(0);

    } catch (error) {
        console.error(`❌ Error seeding areas: ${error.message}`);
        process.exit(1);
    }
};

seedAreas();
