require('dotenv').config()

const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const models = require('../model')
const simpleDAO = require('../DAO/simpleDAO')
const jwt = require('jsonwebtoken')

function generateAccessToken(user_email) {
    return jwt.sign(user_email, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}

router.post('/token', async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) res.sendStatus(401);
    // TODO: Check if its in the database
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = generateAccessToken({email : user.body.email})
        return res.json({accessToken: accessToken}).send();
    })
})

router.delete('/logout', (req, res) => {
    // delete the refresh token from database
    res.sendStatus(204);
})

router.post('/login', async (req, res) => {
    try {
        const user = await simpleDAO.findOne({ email : req.body.email }, models.user);
        console.log("Found user", user);
        if(user == null) {
            res.sendStatus(404);
        }
        if(await bcrypt.compare(req.body.password, user.password)) {
            // User is now Authenticated. Further we will send a token for authorisation
            const accessToken = generateAccessToken({ email: user.email });
            const refreshToken = jwt.sign({email: user.email}, process.env.REFRESH_TOKEN_SECRET);
            res.json({accessToken: accessToken, refreshToken: refreshToken}).send();
        } else {
            res.sendStatus(403);
        }
    } catch {
        res.sendStatus(500);
    }
})

router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(hashedPassword)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        console.log(user)
        simpleDAO.save(user, models.user)
        res.sendStatus(201)
    } catch {
        res.sendStatus(500)
    }
})

module.exports = router