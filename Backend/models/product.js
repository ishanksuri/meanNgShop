const mongoose = require('mongoose'); //this thing here is like importing library
//using mongoose schema...using postman to send data to DB product collection
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    images: [
        {
            type: String,
        },
    ],
    brand: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        default: 0,
    },

    //we're using category Id ie objectId to connect it to category Schema(table)
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    // countInStock: Number,
    //required
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

//to covert _id to id so that i can be used by any backend usinf - virtuals
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

//to send some value to frontend/api we enable the virtuals
productSchema.set('toJSON', {
    virtuals: true,
});

//mongoose model
// const Product = mongoose.model('Product', productSchema)

//if we are exporting like this, then we need to to import in other file as a object ie {Product}
exports.Product = mongoose.model('Product', productSchema);
exports.productSchema = productSchema;
