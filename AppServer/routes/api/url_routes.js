require('dotenv').config()

var express = require('express')
var router = express.Router()
var https = require('https')
const axios = require('axios')
const models = require('../../model')
const simpleDAO = require('../../DAO/simpleDAO')
const jwt = require('jsonwebtoken')

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

function authenticate(req, res, next) {
    console.log('Inside Authenticate middleware')
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]
    if (accessToken == null) return res.sendStatus(401);

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

router.get('/:shortUrlId', async (req, res) => {
    // console.log("req", req);
    try {
        const shortUrlId = req.params.shortUrlId;
        const filter = {
            shortUrlId: shortUrlId
        }
        const record = await simpleDAO.findOne(filter, models.url);
        if(record != null && (record.expiryDate == null || Date.now() <= record.expiryDate)) {
            res.status(302).redirect(record.longUrl);
        } else {
            res.status(400).send("Please register the url before use");
        }
    } catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
})

router.post('/', authenticate, async (req, res) => {
    try{ 
        console.log("User", req.user)
        const longUrl = req.body.longUrl;
        const shortURlRespose = await axios.get('http://localhost:3001/shortUrl/');
        console.log("response from shorturl", shortURlRespose);
        if (shortURlRespose.status == 200) {
            const shortUrl = "localhost:3000/api/"+shortURlRespose.data.shortUrl._id;
            const record = {
                longUrl: longUrl,
                shortUrlId: shortURlRespose.data.shortUrl._id
            }
            await simpleDAO.save(record, models.url);
            res.json({
                "shortUrl": shortUrl,
                "longUrl": longUrl
            })
        } else {
            res.status(500).send("Something went wrong :(");
        }
    } catch(err) {
        console.error(err);
        res.status(400).send("Bad Request");
    }
})

module.exports = router