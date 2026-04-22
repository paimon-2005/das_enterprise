const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
        },
        discountPrice: {
            type: Number,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
        },
        stock: {
            type: Number,
            default: 0,
        },
        minOrderQty: {
            type: Number,
            default: 1,
        },
        unit: {
            type: String,
            enum: ["kg", "piece", "box", "can", "bag", "pack"],
            default: "piece",
        },
        images: {
            type: [String],
            default: []
        },
        tags: {
            type: [String],
            default: []
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        ratings: {
            avg: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
        },
        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            trim: true,
        },
        hsnCode: {
            type: String,
            trim: true,
        },
        mrp: {
            type: Number,
            default: 0,
        },
        gstPercent: {
            type: Number,
            default: 5,
        },
        discountPercent: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

productSchema.pre('save', async function () {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    
    // Auto-generate SKU if not provided
    if (!this.sku) {
        const timestamp = Date.now().toString().slice(-4);
        const prefix = this.category ? this.category.slice(0, 3).toUpperCase() : 'PROD';
        this.sku = `${prefix}-${this.name.slice(0, 3).toUpperCase()}-${timestamp}`;
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
