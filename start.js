var app = require('./app');
var browserSync = require('browser-sync');
var watch = require('gulp-watch');
var config = require('./config');

browserSync.init({
    proxy: ('http://127.0.0.1:' + app.port),
    port: 8000,
    logConnections: true,
    logFileChanges: true,
    ghostMode: false,
    ui: false
});

var restart = function(){
    var start = new Date();
    app.rebuild(function(){
        console.log(new Date() - start);
        browserSync.reload();
    });
};

for (slide in config.slides){
    watcher(slide)
}

function watcher(slide){
    watch(process.cwd() + config.slides[slide].file, function(){
        app.createPage.buildSlide(slide, config.slides[slide], browserSync.reload);
    });
}