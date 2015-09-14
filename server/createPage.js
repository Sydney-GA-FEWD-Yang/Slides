var fs = require('fs');

module.exports = function(config){

    var cache;
    var header;
    var footer;
    var pages = {};
    var cwd = process.cwd();


    fs.readFile(cwd + '/pages/404.html', function(err, data){
        if (!err) {
            pages.notFound = data.toString();
        } else {
            pages.notFound = 'Page not found';
        }
    })

    var serve = function (slide){
        return cache[slide];
    };

    var buildCache = function (cb){
        cache = {};
        count = 0;
        fs.readFile(cwd + '/includes/header.html', function(err, data){
            header = data;
            if (!err) {
                fs.readFile(cwd + '/includes/footer.html', function(err, data){
                footer = data;
                if (!err) {
                    for (slide in config.slides) {
                        count++;
                        (function (slide, config){
                            fs.readFile(cwd + config.file, function(err, data){
                                if (!err){
                                    var dataBuffer = config.includes ? Buffer.concat([header, data, footer]) : data;
                                    cache[slide] = dataBuffer.toString();
                                    count --;
                                    if (count === 0 && cb) cb();
                                } else {
                                    cache[slide] = pages.notFound;
                                }
                            })
                        })(slide, config.slides[slide]);
                    }
                }
                })
            }
        });
    };

    var buildSlide = function (slide, config, cb){
        (function (slide, config){
            fs.readFile(process.cwd() + config.file, function(err, data){
                var dataBuffer = config.includes ? Buffer.concat([header, data, footer]) : data;
                cache[slide] = dataBuffer.toString();
                if (cb) cb();
            })
        })(slide, config);
    };

    buildCache();

    return {
        serve: serve,
        rebuild: buildCache,
        buildSlide: buildSlide
    }
};
