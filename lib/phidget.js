var EventEmitter = require('events').EventEmitter;
var hid = require('node-hid');
var bufferEqual = require('buffer-equal');

var err = new Buffer([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
var noMatch = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00]);
var empty = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00]);

module.exports = {
  create: function(opt){
    var rfid = findRFID(opt.serial);
    var ee = new EventEmitter();
    rfid.on('data', function(data) {
      if (bufferEqual(data, err)) {
        console.error('Phidget needs a reset');
        return;
      }
      if (bufferEqual(data.slice(2, data.length), noMatch)) {
        return ee.emit('noMatch');
      }
      if (bufferEqual(data, empty)) {
        console.error('empty rfid tag used - please flash it');
        return;
      }
      ee.emit('touch', getItemId(data));
    });

    rfid.on('error', function(err) {
      console.error('ERROR', err);
      ee.emit('error', err);
    });

    return ee;
  }
};

function findRFID(serial){
  var devices = hid.devices();
  var dev = devices.filter(function(d){
    return d.product === 'PhidgetRFID' && d.serialNumber === serial;
  })[0];
  if (!dev) {
    throw new Error('No Phidget plugged in');
  }
  return new hid.HID(dev.path);
}


// shared
function getItemId(buf){
  return buf.toString('base64');
}