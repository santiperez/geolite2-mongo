var db = require('./db')
    ,path = require('path');

config= {
    mongoUrl: 'mongodb://192.168.1.85:27017/geolite-2',
    maxMind: {
        url: 'http://geolite.maxmind.com/download/geoip/database/GeoLite2-City-CSV.zip',
        blockIPv4: 'GeoLite2-City-Blocks-IPv4.csv',
        locations: 'GeoLite2-City-Locations-en.csv'
    },
    downloadsFolder:path.join(__dirname,'..','data'),
    autoUpdate: true
}

db.init(config.mongoUrl);
