const AppError = require('../utils/appError');

const restrictToAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        console.warn(`Unauthorized admin access attempt by user ${req.user._id} (${req.user.email}) from IP ${req.ip}`);
        return next(new AppError('Access denied. Admins only.', 403));
    }
    next();
};

module.exports = { restrictToAdmin };
