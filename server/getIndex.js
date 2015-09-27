var fs = require('fs');
var config = require('../config');

var fileContents = '';

module.exports = function(req, res){
    if (fileContents) {
        res.send(fileContents);
    } else {
        fs.readFile(process.cwd() + '/index.html', function(err, data){
            var contents = '';
            for (var slide in config.slides){
                if (config.slides[slide].active) contents += '<li><a href="' + slide + '">' + config.slides[slide].name + '</a></li>';
            }
            fileContents = data.toString().replace('{{contents}}', contents);
            res.send(fileContents);
        });
    }
};