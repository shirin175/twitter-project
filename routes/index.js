var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index',{title:'Twitter Dashboard'});
});

router.get('/statistics/:username', function(req, res, next) {
    res.render('renderedData',{title:'Statistics',output:req.params.username});
});

router.get('/error', function(req, res, next) {
    res.render('error',{error:res});
});

router.get('/about', function(req, res, next) {
    res.render('about',{title:'About'});
});

router.post('/submit',function(req,res,next){
    var username = req.body.username;
    var regex = /[$€&"+,:;=?@#|'<>.^*()%!-]/;
    if(username.match(regex)!=null) {
        res.render('error',{error:'Username contains illegal characters'});
    }
    else {
        res.redirect('/statistics/'+username);
    }
});



module.exports = router;
