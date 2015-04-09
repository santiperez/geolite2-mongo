var assert = require('assert')
    , path = require('path')
    , utils = require('../lib/utils');


describe('IPAddress', function(){
    var ip1='80.26.90.116';
    it('Aton IPv4 '+ ip1, function(){
        assert.equal(utils.IPv4.addressAton(ip1),1343904372);
    });

    var ip3='1343904372';
    it('Ntoa IPv4 '+ ip3, function(){
        assert.equal(utils.IPv4.addressNtoa(ip3),'80.26.90.116');
    });
});

describe('Download file', function(){
    var file = 'http://geolite.maxmind.com/download/geoip/database/GeoLite2-City-CSV.zip';
    var dstFolder = path.join(__dirname,'..','data');
    it(file+'. Destination folder '+dstFolder+' ', function(done){
        this.timeout(45000);
        utils.Files.downloadFile(file,dstFolder,function (err,result){
            assert.equal(err,null);
            assert.equal(result,path.join(dstFolder,'GeoLite2-City-CSV.zip'));
            done();
        });
    });
});

describe('Unzip file', function(){
    this.timeout(15000);

    var file = path.join(__dirname,'..','data','GeoLite2-City-CSV.zip');
    var dstFolder = path.join(__dirname,'..','data');

    it(file+'. Destination folder '+dstFolder+' ', function(done){
        utils.Files.unzipFile(file,dstFolder,function (err,result){
            assert.equal(err,null);
            assert.notEqual(result.length,0);
            done();
        });
    });
});

describe('Get address Range', function(){
    var ipRange1='1.0.0.0/24';
    it('ip address '+ipRange1+' ', function(){
        var result=utils.IPv4.getAddressRangeInfo(ipRange1);
        assert.equal(result.ipLowStr,'1.0.0.0');
        assert.equal(result.ipHighStr,'1.0.0.255');
    });
});