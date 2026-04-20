const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Area name is required'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual for dealers count (to be populated later if needed)
areaSchema.virtual('dealersCount', {
    ref: 'Dealer',
    localField: '_id',
    foreignField: 'area',
    count: true
});

const Area = mongoose.model('Area', areaSchema);
module.exports = Area;
