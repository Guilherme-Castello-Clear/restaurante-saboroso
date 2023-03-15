var express = require('express');
var router = express.Router();
var admin = require('./../inc/admin')
var users = require('./../inc/users');

router.use(function(req, res, next){

    if(['/login'].indexOf(req.url) === -1 && !req.session.user){
        res.redirect('/admin/login')
    }
    else{
        next();
    }

    console.log("MIDDLEWARE: "+req.url)

});

router.use(function(req, res, next){
    req.menus = admin.getMenus();
    next();
})


router.get('/logout', function(req, res, next){

    delete req.session.user;
    res.redirect("/admin/login")
    
});

router.get('/', function(req, res, nex){
    
    res.render('admin/index', {
        menus: req.menus
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
    res.render('admin/contacts', {
        menus: req.menus
    });
});

router.get('/emails', function(req, res, nex){
    res.render('admin/emails', {
        menus: req.menus
    });
});

router.get('/reservations', function(req, res, nex){
    res.render('admin/reservations', {
        date: {},
        menus: req.menus
    });
});

router.get('/menus', function(req, res, nex){
    res.render('admin/menus', {
        menus: req.menus
    });
});

router.get('/users', function(req, res, nex){
    res.render('admin/users', {
        menus: req.menus
    });
});


module.exports = router;