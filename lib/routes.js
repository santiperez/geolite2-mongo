var express = require('express')
    ,app = express()
    ,utils =require('./utils')
    ,geoIpInfo = require ('./models/geoipinfo');

/* GET users listing. */
app.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

app.get('/locate', function(req, res) {
    //getting the ip of the client from the request headers or remoteAddress
    var ip = (req.query!=undefined && req.query.ip!=undefined)?req.query.ip:undefined;

    ip = ip || req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    //88.10.161.177
    geoIpInfo.getInfo(ip, function(err,info){
        res.json({info:info});
    });
});

var port=4000;
module.exports.server = app.listen(port, function() {
    console.log('geoip web service listening on port', port);
});