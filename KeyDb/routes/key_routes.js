var express = require('express')
var router = express.Router()
const getShortUrl = require('../businessLogic/getShortUrl');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', async (req, res) => {
    const shortUrl = await getShortUrl();
    console.log("shortURL", shortUrl)
    if(shortUrl != null) {
        res.json({
            "shortUrl": shortUrl
        });
    } else {
        res.status(500).send("Cannot fetch shortURL");
    }
})

module.exports = router;