const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Owner name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 8,
            select: false,
        },
        role: {
            type: String,
            enum: ['admin', 'dealer'],
            default: 'dealer',
        },
        // Shop Details
        shopName: {
            type: String,
            required: [function() { return this.role === 'dealer'; }, 'Shop name is required'],
            trim: true,
        },
        area: {
            type: String, // e.g. 'Mogra', 'Jirat', 'Kuntighat'
            required: [function() { return this.role === 'dealer'; }, 'Shop area is required'],
        },
        shopAddress: {
            type: String,
            // optional
        },
        phone: {
            type: String,
            required: [function() { return this.role === 'dealer'; }, 'WhatsApp number is required'],
        },
        gstNumber: {
            type: String,
        },
        businessType: {
            type: String, // Kirana Store, Restaurant, etc.
        },
        paymentTerm: {
            type: String,
            enum: ['cash', 'credit', 'weekly'],
            default: 'cash',
        },
        creditLimit: {
            type: Number,
            default: 0,
        },
        currentDue: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        refreshToken: {
            type: String,
            select: false,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts and lock if necessary
userSchema.methods.incrementLoginAttempts = async function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }

    // Increment attempts
    const updates = { $inc: { loginAttempts: 1 } };

    // Lock for 30 mins if 5 failed attempts
    if (this.loginAttempts + 1 >= 5) {
        updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 };
    }

    return this.updateOne(updates);
};

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    delete obj.loginAttempts;
    delete obj.lockUntil;
    return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
