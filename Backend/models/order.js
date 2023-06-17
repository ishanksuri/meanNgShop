const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    //we're using orderItems Id ie objectId to connect it to orderItem Schema(table)
    //we are using array because here we could have multiple orderItems (unlike one category per product)
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderItem',
            required: true,
        },
    ],
    shippingAddress1: {
        type: String,
        required: true,
    },
    shippingAddress2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
});

//to covert _id to id so that i can be used by any backend usinf - virtuals
orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

//to send some value to frontend/api we enable the virtuals
orderSchema.set('toJSON', {
    virtuals: true,
});

exports.Order = mongoose.model('Order', orderSchema);

//Order Example

// {
//     "orderItems": [
//         {
//             "quantity": 3,
//             "product": "634efa9067f646476d004739"
//         },
//         {
//             "quantity": 2,
//             "product": "6318ebbad1853410be1e68e8"
//         }
//     ],
//     "shippingAddress1": "Flowers Street, 45",
//     "shippingAddress2": "1-B",
//     "city": "Prague",
//     "zip": "00000",
//     "country": "Czech Republic",
//     "phone": "+420702241333",
//     "user": "633c7f4db439ec5a8bf0365d"
// }
