var express = require('express');
var app = express();

var cart = require('./basket');
var checkoutStatus = require('./checkout');

app.get('/', function(req, res){
  res.json({
    checkout: checkoutStatus,
    cart: cart
  });
});

app.listen(8080);