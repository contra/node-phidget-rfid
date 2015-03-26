var express = require('express');
var staticCache = require('express-static-cache');
var app = express();

var cart = require('./basket');
var checkoutStatus = require('./checkout');

app.get('/status', function(req, res){
  res.json({
    checkout: checkoutStatus,
    cart: cart
  });
});

app.use(staticCache(__dirname, '/client', {
  maxAge: 365 * 24 * 60 * 60
}));
app.use(express.static(__dirname + '/client'));

app.listen(8080);