var TABLE = 'geoIPInfo';

var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

module.exports = {
    _schema: new Schema(
        {
            network:{ type: String, required:true, index:true},
            networkAddressDec:{ type: String,required:true, index:true},
            broadcastAddressDec:{ type: String,required:true, index:true},
            networkAddress: {type: String},
            broadcastAddress: {type: String},
            geoNameId:{type: String, required:true, required:true},
            coordinates:{
                lat:{type: Number},
                long:{type: Number}
            },
            location:{
                continentCode:{type: String},
                continentName:{type: String},
                countryCode:{type: String},
                countryName:{type: String},
                subdivisionName:{type: String},
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
        var model = mongoose.model(TABLE, this._schema);
        model.findOne({networkAddressDec:{$gt: ip},broadcastAddressDec:{$gt: ip}},{_id:0, __v:0}, callback);
    },
    addBlock: function(data, callback)
    {

        var model = mongoose.model(TABLE, this._schema);
        var data = new model();

        model.findOneAndUpdate({
            network: data.network
        }, {
            $set: {
                networkAddressDec: data.networkAddressDec,
                broadcastAddressDec: data. broadcastAddressDec,
                networkAddress: data.networkAddress,
                broadcastAddress: data. broadcastAddress,
                geoNameId: data.geoNameId
            }
        }, {
            upsert: true
        }, callback);
    },
    addLocation: function(data, callback)
    {

        var model = mongoose.model(TABLE, this._schema);
        var data = new model();

        model.findOneAndUpdate({
            network: data.network
        }, {
            $set: {
                coordinates: data.coordinates,
                location:data.location
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