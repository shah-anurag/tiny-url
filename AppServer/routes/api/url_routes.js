require('dotenv').config()

var express = require('express')
var router = express.Router()
var https = require('https')
const axios = require('axios')
const models = require('../../model')
const simpleDAO = require('../../DAO/simpleDAO')
const cachedDAO = require('../../DAO/cachedDAO')
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
        if(err) {
            console.error('err', err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}

router.get('/:shortUrlId', async (req, res) => {
    try {
        const shortUrlId = req.params.shortUrlId;
        const filter = {
            shortUrlId: shortUrlId
        }
        // Use cachedDAO for fetching for optimal performance
        const record = await cachedDAO.findOne(filter, models.url, shortUrlId);
        if(record && (record.fromCache || record.expiryDate === null || Date.now() <= record.expiryDate)) {
            res.status(302).redirect(record.longUrl);
        } else {
            res.status(400).send("Please register the url before use");
        }
    } catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
})

async function fetchShortUrlForExistingLongUrl(longUrl) {
    try {
        const filter = {
            longUrl: longUrl
        }
        const record = await simpleDAO.findOne(filter, models.url);
        console.debug('Found: ', record);
        return record;
    } catch(err) {
        console.error('Error while fetching shortUrl for existing longUrl: ', err);
    }
}

router.post('/', async (req, res) => {
    try{
        const longUrl = req.body.longUrl;
        const shortURlRespose = await axios.get('http://localhost:3001/shortUrl/');
        // console.log("response from shorturl", shortURlRespose);
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
        // Check if duplicate Error -> Might have caused due to already existing longurl
        if(err.name === 'MongoError' && err.code === 11000) {
            console.log("MongoError!");
            const longUrl = req.body.longUrl
            const record = await fetchShortUrlForExistingLongUrl(longUrl);
            console.debug('Got: ', record);
            if(record) {
                const shortUrl = "localhost:3000/api/"+record.shortUrlId;
                res.json({
                    "shortUrl": shortUrl,
                    "longUrl": longUrl
                })
            } else {
                record.send(500);
            }
        } else {
            res.status(400).send("Bad Request");
        }
    }

})

module.exports = router