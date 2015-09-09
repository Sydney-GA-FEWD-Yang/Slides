var express = require('express');
var app = express();
var config = require('./config');
var createPage = require('./server/createPage')(config);

var port = process.env.port || 3000;

function createRoute(slide){
    app.get(slide, function(req, res){
        res.send(createPage.serve(slide));
    });
}

app.use('/static', express.static(process.cwd() + '/static'));

for (var slide in config.slides){
    createRoute(slide, config.slides[slide].file);
}

app.listen(port);

console.log('server started on ' + port);

module.exports = {
    port: port,
    rebuild: createPage.rebuild
}