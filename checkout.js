var hid = require('node-hid');
var bufferEqual = require('buffer-equal');

var rfid = findRFID();
var err = new Buffer([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
var noMatch = new Buffer([0x01, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00]);
var empty = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00]);

// checkout
var needsCheckout = false;

rfid.on('data', function(data) {
  if (bufferEqual(data, noMatch)) {
    return;
  }
  if (bufferEqual(data, err)) {
    console.error('Phidget needs a reset');
    return;
  }
  if (!needsCheckout) {
    needsCheckout = true;
    console.log('needs checkout');
  }
});

rfid.on('error', function(err) {
  console.error('ERROR', err);
});

function findRFID(){
  var devices = hid.devices();
  var dev = devices.filter(function(d){
    return d.product === 'PhidgetRFID';
  })[0];
  if (!dev) {
    throw new Error('No Phidget plugged in');
  }
  return new hid.HID(dev.vendorId, dev.productId);
}


// shared
function getItemId(buf){
  return buf.toString('base64');
}
