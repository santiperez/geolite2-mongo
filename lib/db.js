var mongoose = require('mongoose')
    ,geoIPInfo = require('./models/geoipinfo')
    ,updateDB = require('./updatedb');

module.exports = {
    _db: null,
    init: function(mongoUrl) {
        if(!module.exports._db) {

            module.exports._db = mongoose.connect(mongoUrl, {
                server:{
                    auto_reconnect: true,
                    socketOptions:{
                        connectTimeoutMS:3600000,
                        keepAlive:3600000,
                        socketTimeoutMS:3600000
                    }
                }});
        }
        return module.exports._db;
    }
}