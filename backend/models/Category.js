const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide category name'],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
        },
        image: {
            public_id: String,
            url: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

categorySchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
