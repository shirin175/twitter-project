var express = require('express');
var router = express.Router();

var sanitize = require('../controllers/sanitizedata');
var Twitter = require('twitter');
var dotenv = require('dotenv');
dotenv.config();

var client = new Twitter({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
});
var params ={screen_name: '',include_rts:'0',exclude_replies:'0',count:'200',tweet_mode:'extended'};

router.get('/weekday/:username', function(req, res, next) {
    params.screen_name = req.params.username;
    client.get('statuses/user_timeline', params,function(error, tweets, response) {
        if(error) {
            res.status(401).json(error);
        }
        else {
            let tweetedOnDay = sanitize.getWeekDay(tweets);
            res.status(200).json(tweetedOnDay);
        }
    });
});

router.get('/devices/:username', function(req, res, next) {
    params.screen_name = req.params.username;
    client.get('statuses/user_timeline', params,function(error, tweets, response) {
        if(error) {
            //console.log(error);
            res.status(401).json(error);
        } else {
            let devicesUsed = sanitize.parseUsedDevice(tweets);
            res.status(200).json(devicesUsed);
        }
    });
});
router.get('/interactions/:username', function(req, res, next) {
    params.screen_name = req.params.username;
    client.get('statuses/user_timeline', params,function(error, tweets, response) {
        if(error) {
            res.status(401).json(error);
        } else {
            let usersInteractedWith = sanitize.extractInteractions(tweets);
            res.status(200).json(usersInteractedWith);
        }
    });
});


router.get('/tweets/:username', function(req, res, next) {
    params.screen_name = req.params.username;
    client.get('statuses/user_timeline', params,function(error, tweets, response) {
        if(error) {
            res.status(401).json(error);
        } else {
            let usedWords = sanitize.sanitizeFullText(tweets);
            let usedLanguage = sanitize.getLanguage(tweets);
            let sentimentAnalysis = {};
            //if no tweets exist
            if(usedWords.length !==0 && usedLanguage ==='de'|| usedLanguage ==='en') {
                sentimentAnalysis = sanitize.sentiment(usedWords,usedLanguage);
            }
            //console.log(sentimentAnalysis);
            res.status(200).json(sentimentAnalysis);
        }
    });
});
/*
router.get('/metrics/:username', function(req, res, next) {
    params.screen_name = req.params.username;
    client.get('statuses/user_timeline', params,function(error, tweets, response) {
        if(error) {
            res.status(401).json(error);
        } else {
            //extrahiere ids
            let allTweetIds = sanitize.extractId(tweets);
            //neuer request um für alle die metrics rauszufischen
            for(let i = 0;i<allTweetIds.length;i++) {
                let paramsNew = {ids:allTweetIds[i]};
                client.get('tweets', paramsNew,function(error, tweets, response) {
                    if(error) {
                        res.status(401).json(error);
                    } else {
                        json = tweets;
                    }
                });
            }
            res.status(200).json(allTweetIds);
        }
    });
});*/

router.get('/:username', function(req, res, next) {
    params.screen_name = req.params.username;
    client.get('users/show', params,function(error, tweets, response) {
        if(error) {
            res.status(401).json(error);
        } else {
            res.status(200).json(tweets);
        }
    });
});


module.exports = router;
