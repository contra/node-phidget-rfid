var phidget = require('./lib/phidget');

var needsCheckout = false;

var dev = phidget.create({
  serial: '35193'
});
dev.on('touch', function(id){
  if (!needsCheckout) {
    needsCheckout = true;
    console.log('needs checkout');
  }
});