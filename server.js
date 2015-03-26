var express = require('express');
var app = express();

var cart = require('./basket');
var checkoutStatus = require('./checkout');

app.get('/status', function(req, res){
  res.json({
    checkout: checkoutStatus,
    cart: cart
  });
});

app.use(express.static(__dirname + '/client'));

app.listen(8080);