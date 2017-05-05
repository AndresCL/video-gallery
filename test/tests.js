// MODULES
QUnit.module("App Base");

// Check if VideoApp exists
QUnit.test( "VideoApp Exists", function( assert ) {
    assert.ok( VideoApp != undefined, "No VideoApp!" );
});

// Check if Router exists and its instantiated
QUnit.test( "Router exists and instantiated", function( assert ) {
    
    // Assertions expected
    assert.expect(2);

    // Is undefined?
    assert.ok( VideoApp.Router != undefined, "No VideoApp.Router fails" );

    // If VideoApp.rt is not an instance of Backbone router
    assert.ok(VideoApp.rt instanceof Backbone.Router, "Not an instance of Backbone.Router fails" );
    
});

// Check if Home View can be loaded after login
QUnit.test("Home/Login View can be loaded", function( assert ) {

    // Assertions expected
    assert.expect(3);
    
    assert.ok(VideoApp.navModel != undefined, "No Navbar Model fails" );
    assert.ok(VideoApp.navView != undefined, "No Navbar View fails" );
    assert.ok(VideoApp.homeView != undefined, "No Home View fails" );
    
});

// Login User + Nested Views and Actions
QUnit.module("Login", {
    
    after: function() {
        
        // ASYNC: After all login test are done
        
        // Views Module
        QUnit.module("Views", function(){
                
            // Check if Videos List View can be loaded after login
            QUnit.test("Videos List View can be loaded after login", function( assert ) {

                // Assertions expected
                assert.expect(4);
                
                assert.ok(VideoApp.User.ssid != "", "No User ID fails" );
                assert.ok(VideoApp.navModel != undefined, "No Navbar Model fails" );
                assert.ok(VideoApp.navView != undefined, "No Navbar View fails" );

                // Async assert
                var videosViewLoaded = assert.async();

                // Instantiating a collection to handle our videos. ONLY if doesn't exists
                if(VideoApp.videoCollection == undefined){
                    VideoApp.videoCollection = new VideoApp.Collections.Videos([], { sessionId: null});
                }

                // Instantiating new view. ONLY if doesn't exits
                if(VideoApp.videosView == undefined){
                    VideoApp.videosView = new VideoApp.Views.VideosView;
                }

                $(window).unbind("scroll"); // :D remove listener for this view

                // Load videos from server (max 10 videos)
                VideoApp.videoCollection.fetch({ 
                    data: $.param({ sessionId: VideoApp.User.ssid, limit: 3, skip: 0}),
                    url:'../' + VideoApp.URL_VIDEOS,
                    error: onErrorHandler = function(collection, response, options) {
                        assert.ok(false, "Collection can't be loaded");
                        videosViewLoaded();
                    }
                })
                // On done promise
                .done(function(){

                    // Count loaded videos and save on collection
                    VideoApp.videoCollection.loadedVideos = VideoApp.videoCollection.toJSON().length;

                    $("#videos-container").show(); // show container if was hidden

                    // Rendering video view
                    VideoApp.videosView.render();

                    // VIDEOS LIST LOADED!
                    assert.ok(true);
                    videosViewLoaded();
                });
                
            });

            // Check if Single Video View can be loaded after clic on detail video
            QUnit.test("Videos List View can be loaded after click on detail video", function( assert ) {

                // VideoId
                var videoId = "5906a4035d975f76f0eece3f";

                // Assertions expected
                assert.expect(4);

                // Async assert
                var videoViewLoaded = assert.async();

                assert.ok(VideoApp.User.ssid != "", "No User ID fails" );
                assert.ok(VideoApp.navModel != undefined, "No Navbar Model fails" );

                // Instantiate a new single video model
                VideoApp.Models.videoModel = new VideoApp.Models.VideoModel();

                // Instantiating a collection to handle our videos. ONLY if doesn't exists
                if(VideoApp.videoCollection == undefined){
                    VideoApp.videoCollection = new VideoApp.Collections.Videos([], { sessionId: null});
                }

                assert.ok(VideoApp.videoCollection instanceof Backbone.Collection, "videoCollection should be an instance of Backbone.Collection");

                // Loading model from server
                VideoApp.Models.videoModel.fetch({ 
                    data: $.param({ sessionId: VideoApp.User.ssid, videoId: videoId}),
                    url: '../' + VideoApp.URL_VIDEO,
                    error: onErrorHandler = function(model, response, options) {
                        assert.ok(false, "Model can't be loaded");
                        videoViewLoaded();
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

                        // VIDEOS LIST LOADED!
                        assert.ok(true);
                        videoViewLoaded();
                    }
                    else{
                        // Set newly loaded model, then render (Collection keeps the same)
                        VideoApp.videoView.model.set(VideoApp.Models.videoModel.toJSON());
                        
                        // VIDEOS LIST LOADED!
                        assert.ok(true);
                        videoViewLoaded();
                    }
                });

                // assert.ok(VideoApp.navView != undefined, "No Navbar View fails" );
                
            });
        }); // END VIEW MODULE

        // Rating Module
        QUnit.module("Rating", function(){

            // User can rate videos?
            QUnit.test("User can rate", function( assert ) {
                
                // Async assert
                var rateSaved = assert.async();

                // Getting ID from click event on title
                var videoId = "5906a4035d975f76f0eece3f";
                var videoRate = 5;

                // Calling server
                $.ajax({
                    url: '../' + VideoApp.API + VideoApp.URL_VIDEO + "/" + VideoApp.URL_VIDEO_RANK + "?sessionId=" + VideoApp.User.ssid,
                    contentType: 'application/json',
                    dataType: 'json',
                    type: 'POST',
                    data: '{"videoId": "' + videoId + '", "rating": "' + videoRate + '"}',
                    success: function(res){
                        
                        if(typeof res === 'object'){
                            
                            // If success, save user login data
                            if(res.status == "success"){
                                console.log(res);

                                assert.ok(true);
                                
                            }
                            // Show error msg
                            else {
                                assert.ok(false, res.error); 
                            }
                        }
                        else{
                            assert.ok(false, "No object response will fail");
                        }

                        rateSaved();

                    },
                    // Show error msg
                    error: function(mod, res){
                        assert.ok(false, "Something failed trying to rate the video");
                        rateSaved();
                    }
                });
            });
        });
    }
});

QUnit.test("User Can Login", function(assert){

    // Async assert
    var userLogged = assert.async();

    // Calling server
    $.ajax({
        url: "../" + VideoApp.API + VideoApp.URL_AUTH,
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        data: '{"username": "ali", "password": "5f4dcc3b5aa765d61d8327deb882cf99"}', // password: md5(password)
        success: function(res){
            
            if(typeof res === 'object'){

                if(res.status == 'success'){
                    
                    // Saving for future use
                    VideoApp.User.username = res.username;
                    VideoApp.User.ssid = res.sessionId;
                    
                    assert.ok(true);
                }
                else{
                    assert.ok(false, res.error);
                }
            }
            else{
                assert.ok(false, "No object response will fail");
            }
            
            userLogged();
            
        },
        error: function(mod, res){
            assert.ok(false, "Something failed on login call");
            userLogged();
        }
    });

});