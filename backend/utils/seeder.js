const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

dotenv.config();

const connectDB = require('../config/db');

// Sample Data
const categories = [
    { name: 'Grains & Rice', description: 'Essential staples for every kitchen' },
    { name: 'Oils & Fats', description: 'Cooking oils, ghee, and butter' },
    { name: 'Spices', description: 'Pure and blended spice mixes' },
    { name: 'Dairy', description: 'Fresh milk, cheese, and yogurt' },
    { name: 'Beverages', description: 'Tea, coffee, and juices' }
];

const products = [
    {
        name: 'Basmati Rice Premium',
        description: 'Long grain aromatic basmati rice perfect for biryani.',
        price: 120,
        unit: 'kg',
        stock: 500,
        minStock: 50,
        sku: 'RICE-BAS-001',
        isActive: true,
        isFeatured: true,
        tags: ['staple', 'rice', 'premium']
    },
    {
        name: 'Refined Sunflower Oil',
        description: 'Healthy cooking oil with zero cholesterol.',
        price: 160,
        unit: 'liter',
        stock: 200,
        minStock: 30,
        sku: 'OIL-SUN-002',
        isActive: true,
        isFeatured: true,
        tags: ['cooking', 'oil']
    },
    {
        name: 'Turmeric Powder',
        description: 'Pure organic turmeric powder with high curcumin content.',
        price: 45,
        unit: 'gm',
        stock: 1000,
        minStock: 100,
        sku: 'SPICE-TUR-003',
        isActive: true,
        isFeatured: false,
        tags: ['spice', 'organic']
    },
    {
        name: 'Full Cream Milk',
        description: 'Fresh farm milk with high fat content.',
        price: 65,
        unit: 'liter',
        stock: 0,
        minStock: 10,
        sku: 'DAIRY-MILK-004',
        isActive: true,
        isFeatured: false,
        tags: ['dairy', 'fresh']
    }
];

const importData = async () => {
    try {
        await connectDB();

        await Order.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();

        // Create Admin
        await User.create({
            name: 'Admin User',
            email: 'admin@fooddistributor.com',
            password: 'password123',
            role: 'admin'
        });

        // Create Categories
        const createdCategories = await Category.insertMany(categories);

        // Map categories back to products
        const productsWithCategories = products.map((product, index) => {
            return {
                ...product,
                category: createdCategories[index % createdCategories.length]._id
            };
        });

        await Product.insertMany(productsWithCategories);

        console.log('Data Imported! ✅');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message} ❌`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await Order.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed! 🗑️');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message} ❌`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
