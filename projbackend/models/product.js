const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32,
        minlength: 1,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
        minlength: 1
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    }
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);