VideoApp.Router = Backbone.Router.extend({

    // Defining our routes
    routes: {
        "": "home",
        "home": "home",
        "videos": "loadVideos",
        "video?videoId=:videoId": "loadVideo",
        "logout": "logout"
    },

    home: function(){  

        // Init navModel & navView for navigation bar. Check if model and view exists
        if(VideoApp.navModel == undefined)
        { 
            VideoApp.navModel = new VideoApp.Models.Nav({usuario: ""}); 
            VideoApp.navView = new VideoApp.Views.NavView({model: VideoApp.navModel});
        }

        // Init Home view
        if(VideoApp.homeView == undefined){ VideoApp.homeView = new VideoApp.Views.HomeView; }

        if(VideoApp.User.ssid == ""){
            VideoApp.homeView.render();
        }
        else{
            // Navigate to videos
            VideoApp.rt.navigate('videos', {trigger: true}); 
        }
    },
    loadVideos: function(){  

        var sessionId = VideoApp.User.ssid;

        // If session exists
        if(sessionId != "")
        {
            // Set new model
            VideoApp.navView.model.set({usuario: "Logout (" + VideoApp.User.username + ")"});

            // Instantiating a collection to handle our videos. ONLY if doesn't exists
            if(VideoApp.videoCollection == undefined){
                VideoApp.videoCollection = new VideoApp.Collections.Videos([], { sessionId: null });
            }

            // Instantiating new view. ONLY if doesn't exits
            if(VideoApp.videosView == undefined){
                VideoApp.videosView = new VideoApp.Views.VideosView;
            }

            // Load videos from server (max 10 videos)
            VideoApp.videoCollection.fetch({ 
                data: $.param({ sessionId: sessionId, limit: 10, skip: 0}),
                error: function(collection, response, options) {
                    // TODO HANDLE FETCH ERROR
                }
            })
            // On done promise
            .done(function(){

                // Count loaded videos and save on collection
                VideoApp.videoCollection.loadedVideos = VideoApp.videoCollection.toJSON().length;

                $("#videos-container").show(); // show container if was hidden

                // Rendering video view
                VideoApp.videosView.render();
            });
        }
        else{
            // Navigate to home
            VideoApp.rt.navigate('home', {trigger: true}); 
        }

    },
    loadVideo: function(videoId){
        
        // If session exists and videoId was sent
        if(VideoApp.User.ssid != "" && videoId != ""){
            
            // Destroy videos list view (and hide its container)
            VideoApp.videosView.destroy();

            // Instantiate a new single video model
            VideoApp.Models.videoModel = new VideoApp.Models.VideoModel();

            // Instantiating a collection to handle our videos. ONLY if doesn't exists
            if(VideoApp.videoCollection == undefined){
                VideoApp.videoCollection = new VideoApp.Collections.Videos([], { sessionId: null});
            }

            // Loading model from server
            VideoApp.Models.videoModel.fetch({ 
                data: $.param({ sessionId: VideoApp.User.ssid, videoId: videoId}),
                error: function(model, response, options) {
                    // TODO: Handle url call error
                }
            })
            .done(function(){

                if(VideoApp.videoView == undefined){
                    // Instantiating a new view
                    VideoApp.videoView = 
                        new VideoApp.Views.VideoView({
                            model: VideoApp.Models.videoModel, // Single model for detailed video view
                            collection: VideoApp.videoCollection // Current collection for sidebar
                        });
                }
                else{
                    // Set newly loaded model, then render (Collection keeps the same)
                    VideoApp.videoView.model.set(VideoApp.Models.videoModel.toJSON());
                    VideoApp.videoView.render();
                }
            });
        }
        else {
            // Navigate to home as no ssid exits
            Backbone.history.navigate('home', {trigger:true}); 
        }
    },
    logout: function(){
        
        VideoApp.User.ssid = "";

        // Updating nav model and render it again
        VideoApp.navView.model.set({usuario: ""});
        VideoApp.navView.render();

        // Destroy videos list view
        if(VideoApp.videosView != undefined) VideoApp.videosView.destroy();

        // Destroy single videos view
        if(VideoApp.videoView != undefined) VideoApp.videoView.destroy();

        // Navigate to home
        VideoApp.rt.navigate('home', {trigger: true});
    }
});