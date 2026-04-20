const Product = require('../models/Product');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res, next) => {
    console.log('GET ALL PRODUCTS HIT');
    try {
        const features = new APIFeatures(Product.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        
        const products = await features.query;
        const totalProducts = await Product.countDocuments(new APIFeatures(Product.find(), req.query).filter().query.getFilter());
        
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                total: totalProducts,
                page,
                limit,
                totalPages
            }
        });
    } catch (error) {
        next(error);
    }
};

// GET SINGLE PRODUCT BY SLUG
exports.getProductBySlug = async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) {
            return next(new AppError('No product found with that slug', 404));
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// CREATE PRODUCT - ADMIN ONLY
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE PRODUCT - ADMIN ONLY
exports.updateProduct = async (req, res, next) => {
    try {
        // Find product first to ensure slug updates if name changes (via pre-save hook)
        let product = await Product.findById(req.params.id);
        
        if (!product) {
            return next(new AppError('No product found with that ID', 404));
        }

        // Apply updates
        Object.keys(req.body).forEach(key => {
            product[key] = req.body[key];
        });

        await product.save();

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// DELETE PRODUCT - ADMIN ONLY
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return next(new AppError('No product found with that ID', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE STOCK - ADMIN ONLY
exports.updateStock = async (req, res, next) => {
    try {
        const { stock } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            { stock }, 
            { new: true, runValidators: true }
        );

        if (!product) {
            return next(new AppError('No product found with that ID', 404));
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};
