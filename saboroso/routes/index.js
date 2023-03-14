var conn = require('./../inc/db');
var express = require('express');
var router = express.Router();
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus().then(results => {
    res.render('index', { 
        
      title: 'Restaurante Saboroso!',
      menus: results,
      isHome: true
     });
  })

});

router.get('/contacts', function(req, res, next){
  res.render('contacts', {
    title: 'Contato - Restaurante Saboroso!',
    background: 'images/img_bg_3.jpg',
    h1: 'Diga um oi!',
    isHome: false

  });
})

router.get('/menus', function(req, res, next){

  menus.getMenus().then(results =>{

    reservations.render(req, res);

    
  });  
});

router.get('/reservations', function(req, res, next){
  res.render('reservations', {
    title: 'Reservas - Restaurante Saboroso!',
    background: 'images/img_bg_2.jpg',
    h1: 'Reserve uma mesa!',
    body: req.body
  });
})

router.post('/reservations', function(req, res, next){

  if(!req.body.name){
    reservations.render(req, res, "Digite o nome");
  }
  else if(!req.body.email){
    reservations.render(req, res, "Digite o email");
  }
  else if(!req.body.people){
    reservations.render(req, res, "Insira a quantidade de pessoas");
  }
  else if(!req.body.date){
    reservations.render(req, res, "Digite a data");
  }
  else if(!req.body.time){
    reservations.render(req, res, "Digite o horário");
  }
  else{
    reservations.save(req.body).then(results =>{
      
      req.body = {};
      
      reservations.render(req, res, null, "Reserva realizada com suceso");


    }).catch(err=>{
      reservations.render(req, res, err.message);
      
    })
  }

})

router.get('/services', function(req, res, next){
  res.render('services', {
    title: 'Serviços - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1: 'É um prazer pode servir!'
  });
})

module.exports = router;
