var express = require('express');
const session = require('express-session');
var router = express.Router();
var admin = require('./../inc/admin');
var menus = require('./../inc/menus');
var users = require('./../inc/users');
var reservation = require('./../inc/reservations');
var contacts = require('./../inc/contacts');
var emails = require('./../inc/emails');


var moment = require('moment');

moment.locale('pt-BR');

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
    req.menus = admin.getMenus(req);
    next();
})


router.get('/logout', function(req, res, next){

    delete req.session.user;
    res.redirect("/admin/login")
    
});

router.get('/', function(req, res, nex){
    admin.dashboard().then(data=> {
        res.render('admin/index', admin.getParams(req, {
            data
        }));
    }).catch(err => {
        console.error(err);
    })
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

    contacts.getContacts().then(data => {
        res.render('admin/contacts', admin.getParams(req, {
            data
        }));

    })

});

router.delete('/contacts/:id', function(req, res, next){
    contacts.delete(req.params.id).then(results => {
        res.send(results);
    }).catch(err =>{
        res.send(err);
    })
})



router.get('/emails', function(req, res, next){

    emails.getEmails().then(data => {

        res.render('admin/emails', admin.getParams(req, {
            data
        }));
    });

});

router.delete('/emails/:id', function(req, res, next){

    emails.delete(req.params.id).then(results => {
        res.send(results);
    }).catch(err => {
        res.send(err);
    })

});



router.get('/reservations', function(req, res, nex){

    let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
    let end = (req.query.end) ? req.query.end : moment().subtract(1, 'year').format('YYYY-MM-DD');



    reservation.getReservations(req).then(pag => {

        res.render('admin/reservations', admin.getParams(req, {
    
            date: {
                start,
                end
            },
            data: pag.data,
            moment,
            links: pag.links

        }));
    })

    
});

router.post('/reservation', function(req, res, next){
    reservation.save(req.fields, req.files).then(results => {
        res.send(results);
        console.log("ADMIN ROUTES OK");
    }).catch(err => {
        res.send(err);
    });
})

router.delete('/reservations/:id', function(req, res, next){
    reservation.delete(req.params.id).then(result =>{
        res.send(result)
    }).catch(err => {
        res.send(err)
    });
})



router.post('/menus', function(req, res, next){
    menus.save(req.fields, req.files).then(results => {
        res.send(results);
        console.log("ADMIN ROUTES OK");
    }).catch(err => {
        res.send(err);
    });
})

router.delete('/menus/:id', function(req, res, next){
    menus.delete(req.params.id).then(result =>{
        res.send(result)
    }).catch(err => {
        res.send(err)
    });
})

router.get('/menus', function(req, res, nex){
    menus.getMenus().then(data => {   
        res.render('admin/menus', admin.getParams(req, {
            data
        }));
    })
});

router.get('/users', function(req, res, nex){

    users.getUsers().then(data => {

        res.render('admin/users', admin.getParams(req, {
            data,
        }));


    })

});

router.post('/users', function(req, res, nex){
    
    users.save(req.fields).then(results =>{
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
    
});

router.post('/users/password-change', function(req, res, nex){
    
    users.changePassword(req).then(results =>{
        res.send(results);
    }).catch(err => {
        res.send({
            error: err
        });
    });
    
});

router.delete('/users/:id', function(req, res, nex){
    users.delete(req.params.id).then(results =>{
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
});


module.exports = router;