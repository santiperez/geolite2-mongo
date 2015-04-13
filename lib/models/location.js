var TABLE = 'location';

var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

module.exports = {
    _schema: new Schema(
        {
        geoNameId:{type: String, required:true, index:true},
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
        }),
    count: function(conditions,callback)
    {
        var model = mongoose.model(TABLE, this._schema);
        model.count(conditions, callback);
    },
    get: function(geoNameId,callback)
    {
        var model = mongoose.model(TABLE, this._schema);
        model.findOne({geoNameId:geoNameId},{_id:0, __v:0}, callback);
    },
    add: function(data, callback)
    {

        var model = mongoose.model(TABLE, this._schema);

        model.findOneAndUpdate({
            geoNameId: data.geoNameId
        }, {
            $set: {
                geoNameId:data.geoNameId,
                continentCode:data.continentCode,
                continentName:data.continentName,
                countryCode:data.countryCode,
                countryName:data.countryName,
                subdivision1Code:data.subdivision1Code,
                subdivision1Name:data.subdivision1Name,
                subdivision2Code:data.subdivision2Code,
                subdivision2Name:data.subdivision2Name,
                cityName:data.cityName,
                timeZone:data.timeZone
            }
        }, {
            upsert: true
        }, callback);
    },
    remove: function( geoNameId, callback)
    {

        var model = mongoose.model(TABLE, this._schema);
        var data = new model();

        model.findOneAndRemove({ geoNameId:  geoNameId},callback);

    }
}
