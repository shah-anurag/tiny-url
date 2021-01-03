const express = require('express')
const router = express.Router()
const User = require('../../models/User')

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(err) {
        res.status(400).json({msg: err})
    }
})

router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    })
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch(err) {
        res.status(400).json({msg: err})
    }
})

module.exports = router