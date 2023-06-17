const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    color: {
        //#000
        type: String,
    },
});

//to covert _id to id so that i can be used by any backend usinf - virtuals
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

//to send some value to frontend/api we enable the virtuals
categorySchema.set('toJSON', {
    virtuals: true,
});

exports.Category = mongoose.model('Category', categorySchema);
