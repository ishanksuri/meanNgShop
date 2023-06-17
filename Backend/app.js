// call the library express
const express = require('express');
//app const will call a funct express mentioned in above line
const app = express();
const bodyParser = require('body-parser');
//lib for logging Api request
const morgan = require('morgan');
//this thing here is like importing library
const mongoose = require('mongoose');
//CORS is basically needed to have communication b/w frontend and backend
const cors = require('cors');
//to use environment variable
require('dotenv/config');
const api = process.env.API_URL;
//to protect the API & authenticating JWT middleware
const authJwt = require('./helpers/jwt');
//error Handler
const errorHandler = require('./helpers/error-handler');

//multer
const multer = require('multer');

//options means some type of http request like get or post or put
app.use(cors());
app.options('*', cors());

//to make data understandable by express(backend)
// which is sent by frontend as post request
//we need this method from express so that express will accept json data
//Middleware
// app.use(express.json())
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt()); //any token req which will come will go from here first verifying token's authenticity
//define public upload as a static folder in the middleware of our application as part of excluding from authentication process
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
//handling jwt errors in middleware
app.use(errorHandler);

// app.use(multer);

//Routes
// const categoriessRoutes = require('./routers/products')
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/orders`, ordersRoutes);

// //using mongoose schema...using postman to send data to DB product collection
// const productSchema = mongoose.Schema({
//     name: String,
//     image: String,
//     // countInStock: Number,

//     //required
//     countInStock: {
//         type: Number,
//         required: true,
//     },
// })

// //mongoose model
// const Product = mongoose.model('Product', productSchema)
// const Product = require('./models/product')

//V0- initial route
// app.get('/', (req, res) => {
//     res.send('Hello! API')
// })

//v1- particular route http://localhost:3000/api/v1/products
// app.get(api + '/products', (req, res) => {
//     res.send('Hello! API products')
// })

// v2- BETTER WAY particular route http://localhost:3000/api/v1/products
// app.get(`${api}/products`, (req, res) => {
//     res.send('Hello! API products')
// })

//v3- data getting from frontend
// app.get(`${api}/products`, (req, res) => {
//     //treat it like data from DB
//     const product = {
//         id: 1,
//         name: 'hair dresser',
//         image: 'some_url',
//     }
//     // sending data back to front end
//     res.send(product)
// })

// v3- new data created & sent from fronend
// app.post(`${api}/products`, (req, res) => {
//     //reqesting new data from frontend
//     const newProduct = req.body
//     console.log(newProduct)

//     // sending data back to front end
//     res.send(newProduct)
// })

// //v4- api to get the data from the database
// app.get(`${api}/products`, async (req, res) => {
//     //getting data from DB
//     const productList = await Product.find()

//     //to manually chcek aissues with product list
//     if (!productList) {
//         res.status(500).json({ success: false })
//     }
//     // sending data back to front end
//     res.send(productList)
// })

// //v4- api need this to catch the data from frontend & save it in db using mongoose
// app.post(`${api}/products`, (req, res) => {
//     //reqesting new data from frontend
//     const product = new Product({
//         name: req.body.name,
//         image: req.body.image,
//         countInStock: req.body.countInStock,
//     })

//     //saving data in the DB
//     product
//         .save()
//         .then((createdProduct) => {
//             res.status(201).json(createdProduct)
//         })
//         .catch((err) => {
//             res.status(500).json({
//                 error: err,
//                 success: false,
//             })
//         })
// })

//creating a connection to DB server in cloud
mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('Database Connection is ready...');
    })
    .catch((err) => {
        console.log(err);
    });

//(port, callback)
app.listen(3000, () => {
    console.log(api);
    console.log('server is running http://localhost:3000');
});
