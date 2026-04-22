const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        dealer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Snapshots of dealer info at the time of order
        shopName: {
            type: String,
            required: true,
        },
        ownerName: {
            type: String,
            required: true,
        },
        area: {
            type: String, // e.g. 'Mogra', 'Jirat', 'Kuntighat'
            required: true,
        },
        shopAddress: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
        },
        paymentTerm: {
            type: String,
            required: true,
        },
        
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                productName: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                total: {
                    type: Number,
                    required: true,
                },
            },
        ],
        
        subtotal: {
            type: Number,
            required: true,
            default: 0.0,
        },
        tax: {
            type: Number, // 18% GST
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'partial'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'],
            default: 'pending',
        },
        
        notes: String,
        isPaid: {
            type: Boolean,
            default: false,
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: Date,
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
