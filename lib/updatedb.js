var utils = require('./utils')
    ,path = require('path')
    ,fs = require('fs')
    ,Converter=require("csvtojson").core.Converter;


module.exports = {
    _db: null,
    update: function() {
        /*utils.Files.downloadFile(config.maxMind.url,config.downloadsFolder,function(err, filePath){
            if(err){
                console.error(err);
            }else{
                utils.Files.unzipFile(filePath,config.downloadsFolder,function(err, files) {*/
                utils.Files.unzipFile(config.downloadsFolder+'/'+'GeoLite2-City-CSV.zip',config.downloadsFolder,function(err, files) {
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

                            var lp=path.join(config.downloadsFolder,config.maxMind.blockIPv4);

                            var fileStream=fs.createReadStream(lp);
                            var csvConverter=new Converter({constructResult:true});

                            csvConverter.on("record_parsed",function(resultRow,rawRow,rowIndex){
                                console.log(resultRow.network);
                                console.log(utils.IPv4.getAddressRangeInfo(resultRow.network));

                                var p = {network:resultRow.network,
                                    networkAddress:resultRow.ipLowStr,
                                    broadcastAddress:resultRow.ipHighStr,
                                    networkAddressDec:resultRow.ipLow,
                                    broadcastAddressDec:resultRow.ipHigh,
                                    geoNameId: resultRow.geoname_id};

                                console.log(p);


                                /*var ip_parts = resultRow.network.split(":");

                                var ip = '';
                                for (var i=0;i<ip_parts.length;i++){
                                    var ipField=(ipField=='')?0000:ip_parts[i];
                                    ip+=parseInt(ipField,16);
                                    if(i<ip_parts.length-1){
                                        ip+=':';
                                    }
                                }
                                console.log(ip);
                                //var ipInfo={ip:parseInt(hexString, 16);ip};
                                //console.log('dasdas',ipInfo); //here is your result json object*/
                            });

                            //end_parsed will be emitted once parsing finished
                            csvConverter.on("end_parsed",function(jsonObj){
                                //console.log(jsonObj); //here is your result json object
                            });

                            fileStream.pipe(csvConverter);




                        }
                    }
                });
            }
        /*});

    }*/
}