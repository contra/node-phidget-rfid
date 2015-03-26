var phidget = require('./lib/phidget');

var status = {
  needsCheckout: false
};

var dev = phidget.create({
  serial: '35193'
});
dev.on('touch', function(id){
  if (!needsCheckout) {
    status.needsCheckout = true;
    console.log('needs checkout');
  }
});

module.exports = status;