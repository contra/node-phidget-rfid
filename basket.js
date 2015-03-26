var phidget = require('./lib/phidget');

// shopping basket items
var cart = {};
var listening = false;
var lastScan = 0;

var dev = phidget.create({
  serial: '35253'
});

dev.on('noMatch', function(){
  listening = (lastScan <= Date.now() - 2000);
});

dev.on('touch', function(id){
  if (!listening) {
    return;
  }
  listening = false;
  lastScan = Date.now();
  if (!cart[id]) {
    console.log(id, 'added');
    cart[id] = Date.now();
    return;
  }
  if (cart[id]) {
    console.log(id, 'removed');
    delete cart[id];
    return;
  }
});

module.exports = cart;