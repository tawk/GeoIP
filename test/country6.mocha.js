var warning = require('debug')('geoip:test:country6:warning');
var semver = require('semver');
// memwatch only works with node 0.6.x ~ 0.10.x
if (semver.gte(process.version, '0.6.0') && semver.lt(process.version, '0.11.0')) {
    require('memwatch').on('leak', function(info) {
        warning('Memory leak detected: %j', info);
    });
}

var path = require('path');
var mocha = require('mocha');
var chai = require('chai');
chai.Assertion.includeStack = true;

var should = chai.should();

var geoip = require('../index.js');
var Country6 = geoip.Country6;
var file = path.resolve(__dirname, '../database/GeoIPv6.dat');
var instance = new Country6(file, true);

describe('Country6', function() {
  describe('Instance', function() {
    it('should be a object', function(done) {
      instance.should.be.an('object');
      setTimeout(done, 1);
    });

    it('should has a lookup method', function(done) {
      instance.lookup.should.be.a('function');
      setTimeout(done, 1);
    });

    it('should has a lookupSync method', function(done) {
      instance.lookupSync.should.be.a('function');
      setTimeout(done, 1);
    });

    it('should has a update method', function(done) {
      instance.update.should.be.a('function');
      setTimeout(done, 1);
    });
  });

  describe('Synchrouns Lookup', function() {
    it('should throw error when input is not a string', function(done) {
        try {
            instance.lookupSync(null);
        } catch(err) {
            should.exist(err);
            setTimeout(done, 1);
        }
    });

    it('should find location by domain', function(done) {
      var data = instance.lookupSync('www.google.com');
      data.should.be.a('object');
      setTimeout(done, 1);
    });

    it('should find location by ip address', function(done) {
      var data = instance.lookupSync('2406:a000:f0ff:fffe::122d');
      data.should.be.a('object');
      setTimeout(done, 1);
    });
  });

  describe('Asynchrouns Lookup', function() {
     it('should return error when input is not a string', function(done) {
        instance.lookup(null, function(err, data) {
            should.exist(err);
            setTimeout(done, 1);
        });
    });

    it('should find location by demain', function(done) {
      instance.lookup('www.google.com', function(err, data) {
        should.not.exist(err);
        should.exist(data);
        data.should.be.an('object');
        setTimeout(done, 1);
      });
    });

    it('should find location by ip address', function(done) {
      instance.lookup('2607:f0d0:1002:0051:0000:0000:0000:0004', function(err, data) {
        should.not.exist(err);
        should.exist(data);
        data.should.be.an('object');
        setTimeout(done, 1);
      });
    });

    describe('Update database on the fly', function() {
      it('should be ok', function(done) {
        instance.update(file).should.be.ok;
        setTimeout(done, 1);
      });
    });
  });
});
