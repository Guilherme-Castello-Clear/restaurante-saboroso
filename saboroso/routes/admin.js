var express = require('express');
var router = express.Router();
var users = require('./../inc/users');

router.get('/', function(req, res, nex){
    res.render('admin/index', {

    });
});

router.get('/login', function(req, res, nex){

    users.render(req, res, null)
});

router.post('/login', function(req, res, nex){

    if(!req.body.email){
        users.render(req, res, "Insira o email")
    }
    else if(!req.body.password){
        users.render(req,res, "Insira a senha")
    }
    else{
        users.login(req.body.email, req.body.password).then(user => {

            req.session.user = user;

            res.redirect("/admin")

        }).catch(err=>{
            users.render(req,res, err.message || err)
        })
    }

});

router.get('/contacts', function(req, res, nex){
    res.render('admin/contacts');
});

router.get('/emails', function(req, res, nex){
    res.render('admin/emails');
});

router.get('/reservations', function(req, res, nex){
    res.render('admin/reservations', {
        date: {}
    });
});

router.get('/menus', function(req, res, nex){
    res.render('admin/menus');
});

router.get('/users', function(req, res, nex){
    res.render('admin/users');
});


module.exports = router;