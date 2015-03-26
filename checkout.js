var phidget = require('./lib/phidget');

var needsCheckout = false;

var dev = phidget.create();
dev.on('touch', function(id){
  if (!needsCheckout) {
    needsCheckout = true;
    console.log('needs checkout');
  }
});