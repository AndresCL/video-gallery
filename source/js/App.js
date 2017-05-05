// Main
var VideoApp = {

    Views: {},
    Models: {},
    Collections: {},
    Router: {},
    API: './',
    URL_AUTH: 'user/auth',
    URL_VIDEOS: 'videos',
    URL_VIDEO: 'video',
    URL_VIDEO_RANK: 'ratings',
    User: {
        ssid:'',
        username: ''
    },

    navModel: null,
    navView: null,
    homeView: null,

    // To handle for play | pause on videos
    pauseVideos: function(video){

        // Pause all videos but current
        $('video').each(function() {

            // If currently playing video is different
            // from the one we are pausing
            if(video != this){
                $(this).get(0).pause();
            }
        });
    },

    logout: function(){
        
        // Go Home
        Backbone.history.navigate('logout', {trigger:true}); 
    },
    lazyLoadVideos: 5 // Videos to be lazy loaded when scroll is at the bottom
}

// On document Ready
$(document).ready(function(){

    // Init router & history
    VideoApp.rt = new VideoApp.Router();
    Backbone.history.start();  

});