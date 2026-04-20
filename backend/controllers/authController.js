const User = require('../models/User');
const Dealer = require('../models/Dealer');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken = (id, secret, expire) => {
    return jwt.sign({ id }, secret, {
        expiresIn: expire,
    });
};

const createSendToken = async (user, statusCode, res) => {
    const accessToken = signToken(user._id, process.env.JWT_SECRET, process.env.JWT_EXPIRE);
    const refreshToken = signToken(user._id, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRE);

    // Save refresh token to DB (Check if it's a User or Dealer)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Remove password and refresh token from output
    user.password = undefined;
    user.refreshToken = undefined;

    res.status(statusCode).json({
        success: true,
        token: accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name || user.ownerName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            shopName: user.shopName // For dealers
        }
    });
};

exports.register = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (role === 'dealer') {
            const { ownerName, email, password, shopName, area, shopAddress, phone, gstNumber, businessType, paymentTerm } = req.body;

            const dealerExists = await Dealer.findOne({ email });
            if (dealerExists) return next(new AppError('Email already registered', 400));

            const dealer = await Dealer.create({
                ownerName, email, password, shopName, area, shopAddress, phone, gstNumber, businessType, paymentTerm,
                isApproved: false,
                role: 'dealer'
            });

            return res.status(201).json({
                success: true,
                message: 'Registration submitted. Awaiting admin approval.'
            });
        }

        // Default Customer registration
        const { name, email, password, phone } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return next(new AppError('User already exists', 400));

        const user = await User.create({ name, email, password, phone, role: 'customer' });
        createSendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return next(new AppError('Please provide email and password', 400));

        // 1. Try to find in User collection (Admin/Customer)
        let user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        let isDealer = false;

        // 2. If not found, try Dealer collection
        if (!user) {
            user = await Dealer.findOne({ email: email.toLowerCase() }).select('+password');
            isDealer = true;
        }

        if (!user) return next(new AppError('Invalid credentials', 401));

        // 3. For dealers, check approval
        if (isDealer && !user.isApproved) {
            return next(new AppError('Your account is awaiting approval from admin', 403));
        }

        if (!user.isActive) return next(new AppError('Account is deactivated', 403));

        if (!(await user.comparePassword(password))) {
            return next(new AppError('Invalid credentials', 401));
        }

        createSendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        // Find in both models
        let user = await User.findById(req.user._id);
        if (!user) user = await Dealer.findById(req.user._id);

        if (user) {
            user.refreshToken = undefined;
            await user.save({ validateBeforeSave: false });
        }

        res.status(200).json({ success: true, message: 'Logged out' });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) user = await Dealer.findById(req.user._id).populate('area', 'name');

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name || user.ownerName,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                shopName: user.shopName
            }
        });
    } catch (error) {
        next(error);
    }
};

