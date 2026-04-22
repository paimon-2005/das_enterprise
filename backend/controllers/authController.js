const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        user
    });
};

exports.register = async (req, res, next) => {
    try {
        const { 
            name, email, password, shopName, 
            area, shopAddress, phone, paymentTerm,
            gstNumber, businessType 
        } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return next(new AppError('Email already registered', 400));

        // Self-registration always creates a 'dealer'
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            shopName,
            area,
            shopAddress,
            phone,
            paymentTerm: paymentTerm || 'cash',
            gstNumber,
            businessType,
            role: 'dealer'
        });

        createSendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return next(new AppError('Please provide email and password', 400));

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError('Invalid credentials', 401));
        }

        if (!user.isActive) return next(new AppError('Account is deactivated', 403));

        createSendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    res.status(200).json({ success: true, message: 'Logged out' });
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};
