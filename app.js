var express = require('express');
var app = express();
var config = require('./config');
var createPage = require('./server/createPage')(config);

var herokuPing = require('heroku-ping-alive');

var port = process.env.PORT || 3000;

function createRoute(slide, active){
    app.get(slide, function(req, res){
        res.send(active ? createPage.serve(slide) : 'This lab isn\'t active yet');
    });
}

app.use('/static', express.static(process.cwd() + '/static'));

for (var slide in config.slides){
	createRoute(slide, config.slides[slide].active);
}

app.listen(port);

console.log('server started on ' + port);

module.exports = {
    port: port,
    createPage: createPage
}