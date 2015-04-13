var TABLE = 'geoIPInfo';

var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var utils = require('../utils.js');

module.exports = {
    _schema: new Schema(
        {
            network:{ type: String, required:true, index:true},
            networkAddressDec:{ type: String,required:true, index:true},
            broadcastAddressDec:{ type: String,required:true, index:true},
            prefix:{ type: String, index:true},
            networkAddress: {type: String},
            broadcastAddress: {type: String},
            geoNameId:{type: String, required:true},
            coordinates:{
                lat:{type: String},
                long:{type: String}
            },
            location:{
                continentCode:{type: String},
                continentName:{type: String},
                countryCode:{type: String},
                countryName:{type: String},
                subdivision1Name:{type: String},
                subdivision1Code:{type: String},
                subdivision2Name:{type: String},
                subdivision2Code:{type: String},
                cityName:{type: String},
                timeZone:{type: String}
            }
        }),
    count: function(conditions,callback)
    {
        var model = mongoose.model(TABLE, this._schema);
        model.count(conditions, callback);
    },
    getInfo: function(ip,callback)
    {
        ip=utils.IPv4.addressAton(ip);
        var model = mongoose.model(TABLE, this._schema);
        model.findOne({networkAddressDec:{$lt: ip},broadcastAddressDec:{$gt: ip}}).sort({prefixSize:-1}).exec(callback);
    },
    add: function(data, callback)
    {

        var model = mongoose.model(TABLE, this._schema);

        model.findOneAndUpdate({
            network: data.network
        }, {
            $set: {
                network: data.network,
                networkAddressDec: data.networkAddressDec,
                broadcastAddressDec: data. broadcastAddressDec,
                networkAddress: data.networkAddress,
                broadcastAddress: data. broadcastAddress,
                geoNameId: data.geoNameId,
                coordinates: data.coordinates,
                location:data.location,
                prefix:data.prefix
            }
        }, {
            upsert: true
        }, callback);
    },
    remove: function(network, callback)
    {

        var model = mongoose.model(TABLE, this._schema);
        var data = new model();

        model.findOneAndRemove({network: network},callback);
    }
}