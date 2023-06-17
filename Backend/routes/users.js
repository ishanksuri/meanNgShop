const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
//importing lib to hash password
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//1A.Get list of Users
// router.get(`/`, async (req, res) => {
//     const userList = await User.find();

//     if (!userList) {
//         res.status(500).json({ success: false });
//     }
//     res.send(userList);
// });

//1B.Get list of Users excluding password
// router.get(`/`, async (req, res) => {
//     const userList = await User.find().select('-passwordHash');

//     if (!userList) {
//         res.status(500).json({ success: false });
//     }
//     res.send(userList);
// });

//1C.Get list of Users excluding everything except name,phone,email
router.get(`/`, async (req, res) => {
    const userList = await User.find().select(
        'name phone email isAdmin country'
    );

    if (!userList) {
        res.status(500).json({ success: false });
    }
    res.send(userList);
});

//2A.Getting single User by ID
// router.get('/:id', async (req, res) => {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//         res.status(500).json({
//             message: 'The User with the given ID was not found',
//         });
//     }
//     res.status(200).send(user);
// });

//2B.Getting single User by ID
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        res.status(500).json({
            message: 'The User with the given ID was not found',
        });
    }
    res.status(200).send(user);
});

//3.ADDing a User by admin
router.post('/', async (req, res) => {
    //new model of User, so that we can fill it with data coming from FEND
    let user = new User({
        //objs:
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });
    //using await and async, not using then method here
    //then((createdProduct) => { res.status(201).json(createdProduct) }) part
    user = await user.save(); //this save will return promise

    if (!user) return res.status(404).send('the user cannot be registered!');

    res.send(user);
});

//3B.Register User by user
router.post('/register', async (req, res) => {
    //new model of User, so that we can fill it with data coming from FEND
    let user = new User({
        //objs:
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });
    //using await and async, not using then method here
    //then((createdProduct) => { res.status(201).json(createdProduct) }) part
    user = await user.save(); //this save will return promise

    if (!user) return res.status(404).send('the user cannot be registered!');

    res.send(user);
});

//4.UPDATING user with condition where password updation is optional
// means(if user send pass upd req,
//  then update else use old pass)
router.put('/:id', async (req, res) => {
    const userExist = await User.findById(req.params.id);
    let newPassword;
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        //1st parameter- get ID from the user
        req.params.id,
        //2nd paramter is Obj where it contains updated data
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        //by default old data will return by sending PUT req
        //But this parameter can make return new updated data- 3rd parameter
        { new: true }
    );

    if (!user) return res.status(400).send('the user cannot be created!');

    res.send(user);
});

//Login
router.post('/login', async (req, res) => {
    //to check if user is present or not in the db
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;
    if (!user) {
        return res.status(400).send('The user not found');
    }
    // return res.status(200).send(user);

    //(send by user, pass in db)
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        //when user is authenticated, to generate jsonwebtoken
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,
            },
            secret,
            { expiresIn: '1d' }
        );
        res.status(200).send({ user: user.email, token: token });
    } else {
        res.status(400).send('password is wrong!');
    }
});

// 4.DELETE User- isAdmin: true
router.delete('/:id', (req, res) => {
    //this is promise way then method( not await)
    //(to get the id)
    User.findByIdAndRemove(req.params.id)
        .then((user) => {
            if (user) {
                return res.status(200).json({
                    success: true,
                    message: 'the user is deleted!',
                });
            } else {
                return res
                    .status(400)
                    .json({ success: false, message: 'user not found!' });
            }
            //if some error due to db connection or related to server other than category/wrong data/wrong id/in genral
        })
        .catch((err) => {
            return res.status(400).json({ success: false, error: err });
        });
});

//User count for statistics- isAdmin: true
router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments();

    if (!userCount) {
        res.status(500).json({ success: false });
    }
    //normally we return jason
    res.send({
        userCount: userCount,
    });
});

module.exports = router;
