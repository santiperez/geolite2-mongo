var url = require('url')
    ,http = require('http')
    ,path = require('path')
    ,fs = require('fs')
    ,yauzl = require('yauzl')
    ,utils = module.exports = {IPv4:{},Files:{}};

/**
 * Translates an IP Address to it decimal equivalent
 *
 * @param {string} a IP Address
 * @return {int} Returns decimal representation
 */
utils.IPv4.addressAton = function(a) {
    a = a.split(/\./);
    return ((parseInt(a[0], 10)<<24)>>>0) + ((parseInt(a[1], 10)<<16)>>>0) + ((parseInt(a[2], 10)<<8)>>>0) + (parseInt(a[3], 10)>>>0);
};

/**
 * Translates an IP Address in decimal format to its standard format
 *
 * @param {string} a IP Address in decimal representation
 * @return {int} Returns the standar representation of the IP Address
 */
utils.IPv4.addressNtoa = function(n) {
    n = n.toString();
    n = '' + (n>>>24&0xff) + '.' + (n>>>16&0xff) + '.' + (n>>>8&0xff) + '.' + (n&0xff);

    return n;
};

utils.IPv4.getAddressRangeInfo=function(a){
    var a= a.split('/');
    var ip=a[0];
    var prefix=a[1];
    return utils.IPv4.getAddressMaskRange( utils.IPv4.addressAton(ip),prefix);
};

/**
 * Calculates details of a CIDR subnet
 *
 * @param {int} ipNum Decimal IP address
 * @param {int} prefixSize Subnet mask size in bits
 * @return {object} Returns an object with the following fields:
 *
 * ipLow - Decimal representation of the lowest IP address in the subnet
 * ipLowStr - String representation of the lowest IP address in the subnet
 * ipHigh - Decimal representation of the highest IP address in the subnet
 * ipHighStr - String representation of the highest IP address in the subnet
 * prefixMask - Bitmask matching prefixSize
 * prefixMaskStr - String / IP representation of the bitmask
 * prefixSize - Size of the prefix
 * invertedMask - Bitmask matching the inverted subnet mask
 * invertedMaskStr - String / IP representation of the inverted mask
 * invertedSize - Number of relevant bits in the inverted mask
 */
utils.IPv4.getAddressMaskRange=function(ipNum, prefixSize)
{
    var prefixMask = utils.IPv4.getPrefixMask( prefixSize );
    var lowMask = utils.IPv4.getMask( 32 - prefixSize );

    var ipLow = ( ipNum & prefixMask ) >>> 0;
    var ipHigh = ( ( ( ipNum & prefixMask ) >>> 0 ) + lowMask ) >>> 0;

    return {
        'ipLow'				: ipLow,
        'ipLowStr'			: utils.IPv4.addressToString( ipLow ),

        'ipHigh'			: ipHigh,
        'ipHighStr'			: utils.IPv4.addressToString( ipHigh ),

        'prefixMask'		: prefixMask,
        'prefixMaskStr'		: utils.IPv4.addressToString( prefixMask ),
        'prefixSize'		: prefixSize,

        'invertedMask'		: lowMask,
        'invertedMaskStr'	: utils.IPv4.addressToString( lowMask ),
        'invertedSize'		: 32 - prefixSize
    };
};

/**
 * Creates a bitmask with maskSize leftmost bits set to one
 *
 * @param {int} prefixSize Number of bits to be set
 * @return {int} Returns the bitmask
 */
utils.IPv4.getPrefixMask=function( prefixSize )
{
    var mask = 0;
    var i;

    for( i = 0; i < prefixSize; i++ )
    {
        mask += ( 1 << ( 32 - ( i + 1 ) ) ) >>> 0;
    }

    return mask;
}

/**
 * Creates a bitmask with maskSize rightmost bits set to one
 *
 * @param {int} maskSize Number of bits to be set
 * @return {int} Returns the bitmask
 */
utils.IPv4.getMask=function( maskSize )
{
    var mask = 0;
    var i;

    for( i = 0; i < maskSize; i++ )
    {
        mask += ( 1 << i ) >>> 0;
    }

    return mask;
};

/**
 * Creates a bitmask with maskSize leftmost bits set to one
 *
 * @param {int} prefixSize Number of bits to be set
 * @return {int} Returns the bitmask
 */
utils.IPv4.addressToString=function( ipNum )
{
    var d = ipNum % 256;

    for( var i = 3; i > 0; i-- )
    {
        ipNum   = Math.floor( ipNum / 256 );
        d       = ipNum % 256 + '.' + d;
    }

    return d;
}

/**
 * Downloads a given file in a given folder
 *
 * @param {string} file_url url of the file
 * @param {string} destinationFolder folder to store the downloaded file
 * @return {int} Returns the full path of the file downloaded file
 */
utils.Files.downloadFile = function(file_url, destinationFolder, cb) {
    var options = {
        host: url.parse(file_url).host,
        port: 80,
        path: url.parse(file_url).pathname
    };

    var file_name = url.parse(file_url).pathname.split('/').pop();
    var destinationFullPath=path.join(destinationFolder, file_name);
    var file = fs.createWriteStream(destinationFullPath);

    http.get(options, function(res) {
        res.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
            file.end();
            cb(null,destinationFullPath);
        }).on('error', function(err) {
            cb(err);
        });
    });
};

/**
 * Unzips a given file
 *
 * @param {string} filePath location of the zip file
 * @param {string} destinationFolder folder to store the unziped file
 * @return {int} Returns the full path of all files that have been unziped
 */
utils.Files.unzipFile = function (filePath, destinationFolder, cb){
    yauzl.open(filePath,{autoClose: false}, function(err, zipfile) {
        var files=new Array();

        if (err) cb(err);

        zipfile.on("error", function(err) {
            cb(err);
        });

        zipfile.on("entry", function(entry) {
            var re = new RegExp(path.sep+'$');
            if (re.test(entry.fileName)) {
                cb('A file should be specify instead of a directory');
            }
            zipfile.openReadStream(entry, function(err, readStream) {
                if (err) throw err;
                // ensure parent directory exists, and then:
                var fileName=path.normalize(entry.fileName).split(path.sep).pop();
                var p=path.join(destinationFolder, fileName);
                files.push(p);
                readStream.pipe(fs.createWriteStream(p));
            });
        });

        zipfile.once("end", function() {
            zipfile.close();
            cb(null,files);
        });
    });
};

