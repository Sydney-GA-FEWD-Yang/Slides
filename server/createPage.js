var fs = require('fs');

module.exports = function(config){

    var cache;
    var header;
    var footer;

    var serve = function (slide){
        return cache[slide];
    };

    var buildCache = function (cb){
        cache = {};
        count = 0;
        fs.readFile(process.cwd() + '/includes/header.html', function(err, data){
            header = data;
            if (!err) {
                fs.readFile(process.cwd() + '/includes/footer.html', function(err, data){
                    footer = data;
                    if (!err) {
                        for (slide in config.slides) {
                            count++;
                            (function (slide, config){
                                fs.readFile(process.cwd() + config.file, function(err, data){
                                    var dataBuffer = config.includes ? Buffer.concat([header, data, footer]) : data;
                                    cache[slide] = dataBuffer.toString();
                                    count --;
                                    if (count === 0 && cb) cb();
                                })
                            })(slide, config.slides[slide]);
                        }
                    }
                })
            }
        });
    };

    buildCache();

    return {
        serve: serve,
        rebuild: buildCache
    }
};
