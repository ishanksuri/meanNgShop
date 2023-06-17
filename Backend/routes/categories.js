const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

//1.Getting whole list of Categories
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(categoryList);
});

//2.Getting category by ID
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({
            message: 'The Category with the given ID wasnot found',
        });
    }
    res.status(200).send(category);
});

//3.UPDATING THE CATEGORY
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        //1st parameter- get ID from the user
        req.params.id,
        //2nd paramter is Obj where it contains updated data
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        //by default old data will return by sending PUT req
        //But this parameter can make return new updated data- 3rd parameter
        { new: true }
    );

    if (!category)
        return res.status(400).send('the category cannot be created!');

    res.send(category);
});

//4.ADDing a Category
router.post('/', async (req, res) => {
    //new model of Category, so that we can fill it with data coming from FEND
    let category = new Category({
        //objs:
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    });
    //using await and async, not using then method here
    //then((createdProduct) => { res.status(201).json(createdProduct) }) part
    category = await category.save(); //this save will return promise

    if (!category)
        return res.status(404).send('the category cannot be created!');

    res.send(category);
});

//5.Deleting a Category
//('/:id_want_to_delete')
//api/v1/categories/id_want_to_delete
router.delete('/:id', (req, res) => {
    //this is promise way then method( not await)
    //(to get the id)
    Category.findByIdAndRemove(req.params.id)
        .then((category) => {
            if (category) {
                return res.status(200).json({
                    success: true,
                    message: 'the category is deleted!',
                });
            } else {
                return res
                    .status(400)
                    .json({ success: false, message: 'category not found!' });
            }
            //if some error due to db connection or related to server other than category/wrong data/wrong id/in genral
        })
        .catch((err) => {
            return res.status(400).json({ success: false, error: err });
        });
});

module.exports = router;
