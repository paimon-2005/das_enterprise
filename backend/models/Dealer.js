const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const dealerSchema = new mongoose.Schema(
    {
        ownerName: {
            type: String,
            required: [true, 'Owner name is required'],
            trim: true,
        },
        shopName: {
            type: String,
            required: [true, 'Shop name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 8,
            select: false,
        },
        role: {
            type: String,
            default: 'dealer',
        },
        area: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Area',
            required: [true, 'Delivery area is required'],
        },
        shopAddress: {
            type: String,
            required: [true, 'Shop address is required'],
        },
        phone: {
            type: String,
            required: [true, 'Phone/WhatsApp number is required'],
        },
        gstNumber: {
            type: String,
        },
        businessType: {
            type: String,
            required: [true, 'Business type is required'],
        },
        creditLimit: {
            type: Number,
            default: 0,
        },
        currentDue: {
            type: Number,
            default: 0,
        },
        paymentTerm: {
            type: String,
            enum: ['cash', 'credit', 'weekly'],
            default: 'cash',
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        approvedAt: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        avatar: {
            public_id: String,
            url: {
                type: String,
                default: 'https://res.cloudinary.com/demo/image/upload/v1622550114/avatars/default_avatar.png',
            },
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
dealerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to compare password
dealerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Dealer = mongoose.model('Dealer', dealerSchema);
module.exports = Dealer;
