const { Order } = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

//1A List of all Orders
router.get(`/`, async (req, res) => {
    const orderList = await Order.find()
        //i want name from user only
        .populate('user', 'name')
        // //i want all those order sort by name oldest to newest(oldest on top)
        // .sort('dateOrdered');
        //sort newest on top(newest to oldest)
        .sort({ dateOrdered: -1 });

    if (!orderList) {
        res.status(500).json({ success: false });
    }
    res.send(orderList);
});

//1B Get single order by ID
router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
        //i want name from user only, one thing to notice is that it's not in array(unlike orderitems)
        //so we can directly get it using populate('user', 'name')
        .populate('user', 'name')
        //populate orderItems in order-v1
        //.populate('orderItems');
        //diffrent way of populating the product which is inside the "array of orderitems"-v2
        // .populate({ path: 'orderItems', populate: 'product' })
        //if we want to populate category which is inside product (& product is already inside orderitems )-v3
        .populate({
            path: 'orderItems',
            populate: { path: 'product', populate: 'category' },
        });

    if (!order) {
        res.status(500).json({ success: false });
    }
    res.send(order);
});

//2.ADDing a Order along with orderItems in DB
router.post('/', async (req, res) => {
    //using promise.all to resolve two promises we are receving in console.log because user is sending array of orderItems not one so we have to combine those promises together

    const orderItemsIds = Promise.all(
        // looping the array of orderItems sent by the user using map
        req.body.orderItems.map(async (orderItem) => {
            //its like a post request
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product,
            });

            //saving above OrderItems in the DB
            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        })
    );
    // //to check if above asynce(map) funct is returning IDS or promises. Here not returning Ids but 2 promises which got resolved by promise.all into 1 promise
    // console.log(orderItemsIds);

    //now fixing one promise using await
    const orderItemsIdsResolved = await orderItemsIds;
    console.log(orderItemsIdsResolved);

    const totalPrices = await Promise.all(
        //looping the array of orderItemsIdsResolved to get the orderItemId( populate product price)
        orderItemsIdsResolved.map(async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate(
                'product',
                'price'
            );
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice;
        })
    );
    console.log(totalPrices);
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    console.log(totalPrice);

    //new model of Order, so that we can fill it with data coming from FEND
    let order = new Order({
        //objs:
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice, //not taking totalPrice from FE, calculating it in BackENd
        user: req.body.user,
    });
    //using await and async, not using then method here
    //then((createdProduct) => { res.status(201).json(createdProduct) }) part
    order = await order.save(); //this save will return promise

    if (!order) return res.status(400).send('the order cannot be created!');

    res.send(order);
});

//3.UPDATING THE Order status only
router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        //1st parameter- get ID from the user
        req.params.id,
        //2nd paramter is Obj where it contains updated data
        {
            status: req.body.status,
        },
        //by default old data will return by sending PUT req
        //But this parameter can make return new updated data- 3rd parameter
        { new: true }
    );

    if (!order) return res.status(400).send('the order cannot be created!');

    res.send(order);
});

//4.Deleting a Order
//('/:id_want_to_delete')
//api/v1/orders/id_want_to_delete
router.delete('/:id', (req, res) => {
    //this is promise way then method( not await)
    //(to get the id)
    Order.findByIdAndRemove(req.params.id)
        //here we're awaiting for every delete to be done then will return the success mssg in case of success
        .then(async (order) => {
            if (order) {
                await order.orderItems.map(async (orderItem) => {
                    //until each orderItem of array orderItems is delete, it will await
                    await OrderItem.findByIdAndRemove(orderItem);
                    //here we can catch error if orderID(orderItem) not found. But thats not necessary because
                    //that won't vcause issue..order needs to be deleted
                    // .then()
                });

                return res.status(200).json({
                    success: true,
                    message: 'the order is deleted!',
                });
            } else {
                return res
                    .status(400)
                    .json({ success: false, message: 'order not found!' });
            }
            //if some error due to db connection or related to server other than category/wrong data/wrong id/in genral
        })
        .catch((err) => {
            return res.status(404).json({ success: false, error: err });
        });
});

//Statistics- Total sales
router.get('/get/totalsales', async (req, res) => {
    //here, we're grouping or joing all tables/or all documents inside that table to one
    const totalSales = await Order.aggregate([
        //summing all total prices of each order
        //mongoose can't return without _id: null
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } },
    ]);

    if (!totalSales) {
        return res.status(400).send('The order sales cannot be generated');
    }

    // res.send({ totalsales: totalSales });
    //to extract only the total sales
    res.send({ totalsales: totalSales.pop().totalsales });
});

//Order count for statistics-
router.get(`/get/count`, async (req, res) => {
    const orderCount = await Order.countDocuments();

    if (!orderCount) {
        res.status(500).json({ success: false });
    }
    //normally we return jason
    res.send({
        orderCount: orderCount,
    });
});

//Statistics- History of Order- for Specific User
router.get(`/get/userorders/:userid`, async (req, res) => {
    //for specific User
    const userOrderList = await Order.find({ user: req.params.userid })
        .populate({
            path: 'orderItems',
            populate: { path: 'product', populate: 'category' },
        })
        //sort newest on top(newest to oldest)
        .sort({ dateOrdered: -1 });

    if (!userOrderList) {
        res.status(500).json({ success: false });
    }
    res.send(userOrderList);
});

module.exports = router;
