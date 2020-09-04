const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: 'Product'
    },
    count: Number,
    price: Number,
    name: String
});

const orderSchema = new mongoose.Schema({
    products: [productCartSchema],
    transaction_id: {},
    amount: Number,
    address: String, 
    ststus: {
        type: String,
        defult: '',
        enum: ['Processing', 'Shipped', 'Delivered', 'Recieved', 'Cancelled']
    },
    updated: Date,
    user: {
        type: ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = {
    ProductCart: mongoose.model('ProductCart', productCartSchema),
    Order: mongoose.model('Order', orderSchema)
}