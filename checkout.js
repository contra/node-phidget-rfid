var phidget = require('./lib/phidget');

var needsCheckout = false;
var device = phidget.create({
  onData: function(id){
    if (!needsCheckout) {
      needsCheckout = true;
      console.log('needs checkout');
    }
  }
});