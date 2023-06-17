const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },

    //linking the orderItem to Product
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
});

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);
