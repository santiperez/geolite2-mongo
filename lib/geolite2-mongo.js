var db = require('./db')
    ,path = require('path')
    ,routes = require('./routes');

config= {
    mongoUrl: 'mongodb://localhost:27017/geolite-2',
    maxMind: {
        url: 'http://geolite.maxmind.com/download/geoip/database/GeoLite2-City-CSV.zip',
        blockIPv4: 'GeoLite2-City-Blocks-IPv4.csv',
        locations: 'GeoLite2-City-Locations-en.csv'
    },
    downloadsFolder:path.join(__dirname,'..','data'),
    autoUpdate: true
}

db.init(config.mongoUrl);

