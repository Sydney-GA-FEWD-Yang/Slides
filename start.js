var app = require('./app');
var watch = require('watch');
var browserSync = require('browser-sync');

browserSync.init({
    proxy: ('http://127.0.0.1:' + app.port),
    port: 8000,
    logConnections: true,
    logFileChanges: true
});

var restart = function(){
    app.rebuild(function(){
        browserSync.reload();
    });
};

watch.createMonitor('./', function (monitor) {
    monitor.on("created", restart);
    monitor.on("changed", restart);
    monitor.on("removed", restart);
});