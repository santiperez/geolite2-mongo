var utils = require('./utils')
    ,path = require('path')
    ,fs = require('fs')
    ,LineByLineReader = require('line-by-line')
    ,geoIpInfo = require ('./models/geoipinfo')
    ,location = require ('./models/location');


module.exports = {
    _db: null,
    update: function() {
        utils.Files.downloadFile(config.maxMind.url,config.downloadsFolder,function(err, filePath){
            if(err){
                console.error(err);
            }else{
                utils.Files.unzipFile(filePath,config.downloadsFolder,function(err, files) {
                    if(err){console.error(err);}
                    else {
                        var blocksProcessed = false;
                        var locationsProcessed = false;
                        for (var i = 0; i < files.length; i++) {
                            var f = files[i];
                            if (f.indexOf(config.maxMind.blockIPv4) > -1) {
                                blocksProcessed = true;
                            } else if (f.indexOf(config.maxMind.locations) > -1) {
                                locationsProcessed = true;
                            }
                        }
                        if (!locationsProcessed || !blocksProcessed) {
                            console.error('maxMind  csv files not found', config.maxMind.locations, config.maxMind.blockIPv4);
                        }else{

                             var locationsPath=path.join(config.downloadsFolder,config.maxMind.locations);
                             getLocationsData(locationsPath,function(err,res){

                                 var blocksPath=path.join(config.downloadsFolder,config.maxMind.blockIPv4);
                                 getBlockData( blocksPath,function(err,res){

                                 });

                             });
                        }
                    }
                });
            }
        });
    }
}

function getLocationsData(src,cb){

    console.log('Importing locations from file ',src);
    var lr = new LineByLineReader(src);
    var i=0;

    lr.on('error', function (err) {
        console.error(err);
    });

    lr.on('line', function (line) {

        if(i>0) {
            lr.pause();
            var locationData = processLocationData(line.split(','));
            location.add(locationData,function(err,res) {
                if(err){console.error(err);}
                else {
                    i++;
                }
                lr.resume();
            });

        }else{
            i++;
        }
    });

    lr.on('end', function () {
        console.log('Total locations imported:',i-1);
        location.count({},function(err,c) {
            console.log('Total locations in database ',c);
            cb(null,i);
        });
    });

    function processLocationData(data) {
        return {geoNameId:data[0],
            continentCode:data[2],
            continentName:data[3],
            countryCode:data[4],
            countryName:data[5],
            subdivision1Code:data[6],
            subdivision1Name:data[7],
            subdivision1Code:data[8],
            subdivision1Name:data[9],
            cityName:data[10],
            timeZone:data[12]
        };
    }
}

function getBlockData(src,cb){

    console.log('Importing blocks from file ',src);

    var lr = new LineByLineReader(src);
    var i=0;

    lr.on('error', function (err) {
        console.error(err);
    });

    lr.on('line', function (line) {

        if(i>0) {
            lr.pause();
            var blockData = processBlockData(line.split(','));

            location.get(blockData.geoNameId, function(err,location) {
                if(err){throw err;}
                else {
                    if(location==null){console.log('null location',blockData)}
                    blockData.location=location;
                    geoIpInfo.add(blockData, function (err, res) {
                        if(err){console.error(err);}
                        else {
                            i++;
                        }
                        lr.resume();
                    })
                }
            });
        }else{
            i++;
        }
    });

    lr.on('end', function () {
        console.log('Total blocks imported:',i);
        geoIpInfo.count({},function(err,c) {
            console.log('Total blocks in database ',c);
            cb(null,i);
        });
        // All lines are read, file is closed now.
    });

    function processBlockData(data) {
        var blockData =utils.IPv4.getAddressRangeInfo(data[0]);
        return {network: data[0],
            geoNameId: data[1],
            networkAddress: blockData.ipLowStr,
            broadcastAddress: blockData.ipHighStr,
            networkAddressDec: blockData.ipLow,
            broadcastAddressDec: blockData.ipHigh,
            prefix: blockData.prefixSize,
            coordinates:{lat: data[7], long: data[8]}
        };
    }
}