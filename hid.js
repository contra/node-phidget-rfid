var hid = require('node-hid');
var bufferEqual = require('buffer-equal');

var rfid = findRFID();
var err = new Buffer([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
var noMatch = new Buffer([0x01, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00]);
var empty = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00]);

// shopping basket items
var cart = {};
var listening = false;
var lastScan = 0;

rfid.on('data', function(data) {
  if (bufferEqual(data, noMatch)) {
    listening = (lastScan <= Date.now() - 2000);
    return;
  }
  if (bufferEqual(data, err)) {
    console.error('Phidget needs a reset');
    return;
  }
  if (!listening){
    return;
  }
  if (bufferEqual(data, empty)) {
    console.log('empty rfid tag used - please flash it');
    return;
  }
  listening = false;
  lastScan = Date.now();
  var id = getItemId(data);
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

rfid.on('error', function(err) {
  console.error('ERROR', err);
});

setInterval(logCart, 2000);

function logCart(){
  console.log('cart', cart);
}
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
