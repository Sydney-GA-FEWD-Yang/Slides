var express = require('express');
var app = express();
var config = require('./config');
var createPage = require('./server/createPage')(config);

var herokuPing = require('heroku-ping-alive');

var port = process.env.PORT || 3000;
var lab = process.env.lab;

function createRoute(slide, active, labNum){
	if (typeof lab !== 'undefined' && typeof labNum !== 'undefined' && lab < labNum) active = false; 
    app.get(slide, function(req, res){
    	var page = createPage.serve(slide) || 'cannot find';
        res.send(active ? page : 'This lab isn\'t active yet');
    });
}

app.get('/', require('./server/getIndex'));

app.use('/static', express.static(process.cwd() + '/static'));

app.use('/exercises', express.static(process.cwd() + '/exercises'));

for (var slide in config.slides){
	createRoute(slide, config.slides[slide].active, config.slides[slide].labNum);
}

app.listen(port);

console.log('server started on ' + port);

module.exports = {
    port: port,
    createPage: createPage
}