//In ES6 we have this obj destruction so model is returning a obj so creating new obj {Product} and
// assigning field of obj product(model) to {Product} obj
const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
//Router in express is responsible for Creating, Storing, and importing the APIs and importing
//  and exporting them b/w the files
const router = express.Router();

//to validate the :id(post, put)
//the id should be the type of obj id which is stored in mongoose
const mongoose = require('mongoose');

//to handle uploading images- middleware
const multer = require('multer');

//files backend is accepting containing list of extension
//key : value
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

//cb means call-back, it will return if there is an error in uploading
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //validating filetype
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }

        cb(uploadError, './public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        //or
        // const fileName = file.originalname.replace(' ', '-');

        //mimetype includes the info about file extension
        const extension = FILE_TYPE_MAP[file.mimetype];

        // cb(null, fileName + '-' + Date.now());
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

//uploadOptions passing to post request when creating the product
const uploadOptions = multer({ storage: storage });

//1A.Getting productList
//v4- api to get the data from the database
//http://localhost:3000/products
// router.get(`${api}/products`, async (req, res) => {
// router.get(`/`, async (req, res) => {
//     //getting data from DB
//     const productList = await Product.find().populate('category')

//     //to manually chcek aissues with product list
//     if (!productList) {
//         res.status(500).json({ success: false })
//     }
//     // sending data back to front end
//     res.send(productList)
// })

//1B. Getting list of product only image & name, excluding the Id. select is working like a select query
// router.get(`/`, async (req, res) => {
//     const productList = await Product.find().select('name image -_id')
//     if (!productList) {
//         res.status(500).json({ success: false })
//     }
//     res.send(productList)
// })

//1C. Getting a single product via ID
// router.get(`/:id`, async (req, res) => {
//     const product = await Product.findById(req.params.id)

//     if (!product) {
//         res.status(500).json({ success: false })
//     }
//     res.send(product)
// })

//1D. Getting a single product via ID & getting category field linked to another table will be displayed
// using populate
router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        res.status(500).json({ success: false });
    }
    res.send(product);
});

//1.E Getting product list using query parameter filtering by category
//localhost:3000/api/v1/products?categories=2342342,234234
router.get(`/`, async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    //[] is taking array of types of categories
    const productList = await Product.find(filter).populate('category');

    //to manually chcek aissues with product list
    if (!productList) {
        res.status(500).json({ success: false });
    }
    // sending data back to front end
    res.send(productList);
});

//2.Adding new Product
//v4- api need this to catch the data from frontend & save it(post) in db using mongoose
// http://localhost:3000/products
// router.post(`${api}/products`, (req, res) => {
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    //to validate if the category ID exist in DB ?
    //getting ID from Fend in the category which i want to add to the product
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid category');

    //to handle what if frontend send the req without image file
    const file = req.file;
    if (!file) return res.status(400).send('No Image file is in the request');

    //for uploading image- multer library
    const fileName = req.file.filename;
    //"http://localhost:3000/public/upload/image-2323232"
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const imageFileName = req.file.filename;

    //reqesting new data from frontend
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.richDescription,
        //Need full URL for fetching the file not only filename
        //"http://localhost:3000/public/upload/image-2323232"
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    //saving data in the DB
    product = await product.save();

    if (!product) return res.status(500).send('The product cannot be created');

    res.send(product);

    //then method
    // product
    //     .save()
    //     .then((createdProduct) => {
    //         res.status(201).json(createdProduct)
    //     })
    //     .catch((err) => {
    //         res.status(500).json({
    //             error: err,
    //             success: false,
    //         })
    //     })
});

//3.UPDATING THE PRODUCT
//Adding functionality to update 'image' with new image if user uploads new image else keep old image
router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    //validating if the product id is correct or not
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid category');

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product');

    const file = req.file;
    //imagepath either will be the old one or the new one which user is updating
    let imagepath;

    if (file) {
        const fileName = req.file.filename;
        //"http://localhost:3000/public/upload/image-2323232"
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        //new image path
        imagepath = `${basePath}${fileName}`;
    } else {
        //old image path
        imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        //1st parameter- get ID from the user
        req.params.id,
        //2nd paramter is Obj where it contains updated data
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.richDescription,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        //by default old data will return by sending PUT req
        //But this parameter can make return new updated data- 3rd parameter
        { new: true }
    );

    if (!updatedProduct)
        return res.status(500).send('the product cannot be Updated!');

    res.send(updatedProduct);
});

// 4.DELETE
router.delete('/:id', (req, res) => {
    //this is promise way then method( not await)
    //(to get the id)
    Product.findByIdAndRemove(req.params.id)
        .then((product) => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: 'the product is deleted!',
                });
            } else {
                return res
                    .status(400)
                    .json({ success: false, message: 'product not found!' });
            }
            //if some error due to db connection or related to server other than category/wrong data/wrong id/in genral
        })
        .catch((err) => {
            return res.status(400).json({ success: false, error: err });
        });
});

//Product count for statistics- isAdmin: true
router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments();

    if (!productCount) {
        res.status(500).json({ success: false });
    }
    //normally we return jason
    res.send({
        productCount: productCount,
    });
});

//get Featured products
// router.get(`/get/featured`, async (req, res) => {
//     const products = await Product.find({
//         isFeatured: true,
//     })

//     if (!products) {
//         res.status(500).json({ success: false })
//     }
//     //normally we return jason
//     res.send(products)
// })

//get Featured products using count
router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);

    if (!products) {
        res.status(500).json({ success: false });
    }
    //normally we return jason
    res.send(products);
});

//Api specific to upload gallery of images only acc to specific id
router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }

        const files = req.files;
        let imagesPaths = [];
        //"http://localhost:3000/public/upload/image-2323232"
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const product = await Product.findByIdAndUpdate(
            //1st parameter- get ID from the user
            req.params.id,
            //2nd paramter is Obj where it contains updated data
            {
                images: imagesPaths,
            },
            //by default old data will return by sending PUT req
            //But this parameter can make return new updated data- 3rd parameter
            { new: true }
        );

        if (!product)
            return res.status(500).send('the product cannot be Updated!');

        res.send(product);
    }
);

module.exports = router;
