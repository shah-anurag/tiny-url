require('dotenv').config()

const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const models = require('../model')
const simpleDAO = require('../DAO/simpleDAO')
const jwt = require('jsonwebtoken')

function generateAccessToken(user_email) {
    //TODO: Increase the timeout period once done testing
    return jwt.sign(user_email, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TIME_LIMIT || '2m' });
}

function verifyRefreshToken(req, res, next) {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    
    // Authorise using refreshToken and get the user details
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if(err) return res.sendStatus(403);

        console.log('user blah', user);

        // Check if the refreshToken is in the database(to verify its valid)
        // Will get the user info and get the refreshToken from there and verify if its not null
        // Get the user record for authentication
        const userRecord = await simpleDAO.findOne({ email : user.email }, models.user);
        if(userRecord == null) return res.sendStatus(404);
        if(userRecord.refreshToken === refreshToken) {
            req.body.user = userRecord;
            next();
        } else {
            return res.sendStatus(403);
        }
    })
}

// Route to generate a new accessToken from the refreshToken
router.post('/token', verifyRefreshToken, async (req, res) => {
    try {
        // Check if the refreshToken is in the database(to verify its valid)
        // Will get the user info and get the refreshToken from there and verify if its not null
        // Get the user record for authentication
        const user = req.body.user;
        const accessToken = generateAccessToken({email : user.email});
        return res.json({accessToken: accessToken}).send();
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.delete('/logout', verifyRefreshToken, async (req, res) => {
    try {
        const user = req.body.user;
        user.refreshToken = null;
        await simpleDAO.save(user, models.user);
        return res.sendStatus(201);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
});

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

            console.debug('accessToken, refreshToken', accessToken, refreshToken)

            // Update User module with the refreshToken
            user.refreshToken = refreshToken;

            console.debug(user);

            try {
                await simpleDAO.save(user, models.user);
            } catch(e) {
                console.log(e);
            }

            console.log('Saved successfully!');
            return res.json({accessToken: accessToken, refreshToken: refreshToken}).send();
        } else {
            // User isnt authenticated
            return res.sendStatus(403);
        }
    } catch {
        return res.sendStatus(500);
    }
})

router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        console.debug(user)
        simpleDAO.save(user, models.user)
        res.sendStatus(201)
    } catch {
        res.sendStatus(500)
    }
})

module.exports = router