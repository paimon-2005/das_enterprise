const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Unauthorized access.', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return next(new AppError('Unauthorized access.', 401));
        }

        if (!currentUser.isActive) {
            return next(new AppError('Access denied.', 403));
        }

        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(new AppError('Unauthorized access.', 401));
        }
        next(new AppError('Something went wrong.', 500));
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.warn(`Unauthorized role access attempt by user ${req.user._id} (${req.user.email})`);
            return next(new AppError('Access denied.', 403));
        }
        next();
    };
};

module.exports = { protect, restrictTo };
