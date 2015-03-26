var hid = require('node-hid');
var bufferEqual = require('buffer-equal');

var err = new Buffer([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
var noMatch = new Buffer([0x01, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00]);
var empty = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00]);

module.exports = {
  create: function(opt){
    var rfid = findRFID();
    rfid.on('data', function(data) {
      if (bufferEqual(data, noMatch)) {
        if (!opt.noMatch) opt.onNoMatch();
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
      if (!opt.noMatch) opt.onData(getItemId(buf));
    });

    rfid.on('error', function(err) {
      console.error('ERROR', err);
    });
  }
};

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